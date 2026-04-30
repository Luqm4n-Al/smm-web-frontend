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

  wsClient = createClient({
    url:
      wsEndpoint,

    // Auto reconnect jika koneksi putus
    shouldRetry: () => true,
    retryAttempts: 3,

    // Inject token saat koneksi WebSocket dibuat
    connectionParams: () => {
      const token = localStorage.getItem('token');
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },

    on: {
      connecting: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔌 [WS] Connecting...');
        }
      },

      connected: () => {
        sessionStorage.removeItem('ws_error_logged');
        console.log('✅ [WS] Connected!');
      },


      // Udh nggak dipake
      // |
      // |
      // reconnecting: () => {
      //   if (process.env.NODE_ENV === 'development') {
      //     console.log('🔄 [WS] Reconnecting...');
      //   }
      // },

      // reconnected: () => {
      //   console.log('✅ [WS] Reconnected!');
      // },

      closed: () => {
        console.warn('⚠️  [WS] Connection closed');
      },

      error: (error) => {
        const errorKey = 'ws_error_logged';
        if (!sessionStorage.getItem(errorKey)) {
          console.warn(
            `⚠️  [WS] Connection failed. Endpoint: ${process.env.NEXT_PUBLIC_WS_ENDPOINT}`,
            error ?? '(no details)'
          );
          sessionStorage.setItem(errorKey, 'true');
        }
      },
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