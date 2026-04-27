// src/lib/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@/lib/graphql/ApolloProvider';
import { TokenManager } from '@/lib/auth/TokenManager';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider>
        <TokenManager />
        {children}
        <Toaster position="top-right" />
      </ApolloProvider>
    </SessionProvider>
  );
}