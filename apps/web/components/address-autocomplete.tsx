'use client';

import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type AddressSuggestion, useAddressAutocomplete } from '@/hooks/use-address-autocomplete';

interface AddressAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  'aria-label'?: string;
  'aria-invalid'?: 'true' | 'false';
}

export const AddressAutocomplete = ({
  id,
  label,
  placeholder = 'Digite o endereço',
  value,
  onChange,
  onSelect,
  error,
  disabled = false,
  required = false,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
}: AddressAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading } = useAddressAutocomplete({
    query: inputValue,
    enabled: isOpen && inputValue.length >= 3,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 3) {
      setIsOpen(true);
    }
  };

  const handleSelectSuggestion = useCallback(
    (suggestion: AddressSuggestion) => {
      setInputValue(suggestion.address);
      onChange(suggestion.address);
      setIsOpen(false);
      if (onSelect) {
        onSelect(suggestion);
      }
      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel || label}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-suggestions`}
          className={cn(error && 'border-destructive')}
        />
        {isOpen && inputValue.length >= 3 && (
          <div
            id={`${id}-suggestions`}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto"
            role="listbox"
            aria-label="Sugestões de endereço"
          >
            {isLoading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Buscando endereços...</div>
            )}
            {!isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Nenhum endereço encontrado
              </div>
            )}
            {!isLoading &&
              suggestions.length > 0 &&
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors flex items-start gap-3"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  role="option"
                  aria-label={suggestion.address}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSuggestion(suggestion);
                    }
                  }}
                >
                  <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{suggestion.placeName}</p>
                    <p className="text-xs text-muted-foreground truncate">{suggestion.address}</p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

