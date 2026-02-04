import { useCallback, useEffect, useRef } from 'react';

export interface LongPressOptions {
  threshold?: number;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

function useLongPress(callback: () => void, options: LongPressOptions = {}) {
  const { threshold = 400, onStart, onFinish, onCancel } = options;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  const start = useCallback(() => {
    onStart?.();
    isLongPressTriggered.current = false;
    timer.current = setTimeout(() => {
      callback();
      onFinish?.();
      isLongPressTriggered.current = true;
    }, threshold);
  }, [callback, threshold, onStart, onFinish]);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = null;
  }, []);

  const cancel = useCallback(() => {
    clear();
    if (!isLongPressTriggered.current) {
      onCancel?.();
    }
  }, [clear, onCancel]);

  const onMouseDown = useCallback(() => {
    start();
  }, [start]);

  const onMouseUp = useCallback(() => {
    if (timer.current) {
      cancel();
    }
  }, [cancel]);

  const onMouseLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  const onTouchStart = useCallback(() => {
    start();
  }, [start]);

  const onTouchEnd = useCallback(() => {
    if (timer.current) {
      cancel();
    }
  }, [cancel]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
  };
}

export { useLongPress };