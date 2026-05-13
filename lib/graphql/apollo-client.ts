// lib/graphql/apollo-client.ts

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
    console.warn(
      '[Apollo] NEXT_PUBLIC_WS_ENDPOINT is not defined. ' +
      'WebSocket subscriptions will not work. ' +
      'Please check your .env.local file.'
    );
  } else {

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

    // Auto reconnect — retryAttempts sudah membatasi jumlah retry
    shouldRetry: () => true,

    retryAttempts: 5,
    keepAlive: 10_000, // Keep-alive every 10 seconds
    
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
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [WS] Connected!');
        }
      },

      closed: () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️  [WS] Connection closed');
        }
      },

      error: (error) => {
        if (process.env.NODE_ENV === 'development') {
          const errorKey = 'ws_error_logged';
          if (!sessionStorage.getItem(errorKey)) {
            const delay = getRetryDelay();
            console.warn(
              `⚠️  [WS] Connection failed (retry in ${delay}ms). Endpoint: ${process.env.NEXT_PUBLIC_WS_ENDPOINT}`,
              error ?? '(no details)'
            );
            sessionStorage.setItem(errorKey, 'true');
          }
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
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ [WS] Error closing WebSocket:', error);
    }
  }
}

// ─────────────────────────────────────────────
// Reset Apollo Cache
// Gunakan saat: logout
// ─────────────────────────────────────────────
export async function resetApolloCache() {
  try {
    await apolloClient.clearStore();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error clearing Apollo cache:', error);
    }
  }
}