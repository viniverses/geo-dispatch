'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@workspace/ui/components/sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

import { DestinationProvider } from '@/contexts/destination-context';
import { LocationProvider } from '@/contexts/location-context';
import { ProvidersProvider } from '@/contexts/providers-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <LocationProvider>
          <DestinationProvider>
            <ProvidersProvider>
              {children}
              <Toaster position="top-right" closeButton />
            </ProvidersProvider>
          </DestinationProvider>
        </LocationProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
