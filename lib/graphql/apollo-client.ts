// lib/apolloClient.js

import {
  ApolloClient,
  InMemoryCache,
  split,
  createHttpLink,
} from '@apollo/client';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient, Client } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

// ─────────────────────────────────────────────
// HTTP Link
// Digunakan untuk query & mutation
// ─────────────────────────────────────────────
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

// ─────────────────────────────────────────────
// Auth Link
// Inject Authorization header ke setiap request HTTP
// ─────────────────────────────────────────────
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ─────────────────────────────────────────────
// WebSocket Client (graphql-ws)
// Pengganti subscriptions-transport-ws
// Kompatibel dengan gqlgen >= 0.17
// ─────────────────────────────────────────────
let wsClient:Client | null = null

if (typeof window !== 'undefined') {
  const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;

  if (!wsEndpoint) {
    throw new Error(
      '[Apollo] NEXT_PUBLIC_WS_ENDPOINT is not defined. ' +
      'Please check your .env.local file.'
    )
  }

  // Helper untuk exponential backoff retry
  let retryCount = 0;
  const getRetryDelay = () => {
    // 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30_000);
    retryCount += 1;
    return delay;
  };

  wsClient = createClient({
    url: wsEndpoint,

    // Auto reconnect dengan exponential backoff
    shouldRetry: (count) => {
      if (count > 5) {
        console.warn('⚠️  [WS] Max retry attempts (5) reached. Stopping reconnection.');
        return false;
      }
      return true;
    },

    retryAttempts: 5,
    keepalive: 10_000, // Keep-alive every 10 seconds
    
    // ✅ IMPROVED: Exponential backoff untuk reconnection
    on: {
      connecting: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔌 [WS] Connecting...');
        }
      },

      connected: () => {
        retryCount = 0; // Reset retry counter on successful connection
        sessionStorage.removeItem('ws_error_logged');
        console.log('✅ [WS] Connected!');
      },

      closed: () => {
        console.warn('⚠️  [WS] Connection closed');
      },

      error: (error) => {
        const errorKey = 'ws_error_logged';
        if (!sessionStorage.getItem(errorKey)) {
          const delay = getRetryDelay();
          console.warn(
            `⚠️  [WS] Connection failed (retry in ${delay}ms). Endpoint: ${process.env.NEXT_PUBLIC_WS_ENDPOINT}`,
            error ?? '(no details)'
          );
          sessionStorage.setItem(errorKey, 'true');
        }
      },
    },

    // Inject token saat koneksi WebSocket dibuat
    connectionParams: () => {
      const token = localStorage.getItem('token');
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },
  });
}

// ─────────────────────────────────────────────
// WebSocket Link
// ─────────────────────────────────────────────
const wsLink = wsClient ? new GraphQLWsLink(wsClient) : null;

// ─────────────────────────────────────────────
// Split Link
// Subscription → WebSocket
// Query & Mutation → HTTP + Auth
// ─────────────────────────────────────────────
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink);

// ─────────────────────────────────────────────
// Apollo Client Instance
// ─────────────────────────────────────────────
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// ─────────────────────────────────────────────
// Close WebSocket Connection
// Gunakan saat: logout, page unload
// ─────────────────────────────────────────────
export async function closeApolloWebSocket() {
  if (typeof window === 'undefined' || !wsClient) return;

  try {
    await wsClient.dispose();
    console.log('✅ [WS] WebSocket closed');
  } catch (error) {
    console.error('❌ [WS] Error closing WebSocket:', error);
  }
}

// ─────────────────────────────────────────────
// Reset Apollo Cache
// Gunakan saat: logout
// ─────────────────────────────────────────────
export async function resetApolloCache() {
  try {
    await apolloClient.clearStore();
    console.log('✅ Apollo cache cleared');
  } catch (error) {
    console.error('❌ Error clearing Apollo cache:', error);
  }
}

// ─────────────────────────────────────────────
// WebSocket Diagnostic Helper
// ─────────────────────────────────────────────
export function diagnosisWebSocketStatus() {
  if (typeof window === 'undefined') {
    console.log('⚠️  Server-side: WebSocket diagnosis tidak tersedia');
    return;
  }

  const endpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  const token = localStorage.getItem('token');

  console.group('🔍 WebSocket Diagnostic Info');
  console.log('📍 Endpoint  :', endpoint ?? '(not configured)');
  console.log('🔐 Token     :', token ? '✅ Present' : '❌ Missing');
  console.log('🌐 WS Client :', wsClient ? 'graphql-ws (active)' : 'N/A');
  console.log('💡 Jika gagal, cek:');
  console.log('   1. Apakah backend running di:', endpoint);
  console.log('   2. Apakah .env.local sudah dikonfigurasi?');
  console.log('   3. Network / firewall?');
  console.log('   4. CORS settings di backend?');
  console.groupEnd();
}