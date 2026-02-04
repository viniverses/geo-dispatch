'use client';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  isLoading,
  message = 'Obtendo sua localização...',
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <div className="bg-background px-6 py-4 rounded-lg border border-border shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

