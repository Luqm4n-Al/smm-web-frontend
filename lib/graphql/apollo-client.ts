// lib/graphql/apollo-client.ts

/**
 * APOLLO CLIENT CONFIGURATION
 * 
 * File ini berfungsi sebagai pusat konfigurasi
 * Apollo Client untuk aplikasi Next.js.
 * 
 * Fungsi utama:
 * - Menghubungkan aplikasi ke GraphQL API.
 * - Mengatur Query, Mutation, dan Subscription.
 * - Mengelola authentication token.
 * - Mengatur koneksi WebSocket realtime.
 * - Mengatur Apollo cache.
 * 
 * Teknologi yang digunakan:
 * - Apollo Client
 * - graphql-ws
 * - GraphQL Subscription
 * - WebSocket
 */

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

/**
 * HTTP LINK
 * 
 * HTTP Link digunakan untuk:
 * - Query
 * - Mutation
 * 
 * Request dikirim menggunakan HTTP biasa.
 */
const httpLink = createHttpLink({

  /**
   * Endpoint GraphQL API.
   * 
   * Diambil dari environment variable.
   */
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,

  /**
   * Mengirim cookie/session credential.
   */
  credentials: 'include',
});

/**
 * AUTH LINK
 * 
 * Auth Link digunakan untuk:
 * - Menambahkan Authorization header
 * - Mengirim JWT token ke server
 * 
 * Header akan otomatis ditambahkan
 * ke setiap HTTP request.
 */
const authLink = setContext((_, { headers }) => {

  /**
   * Ambil token dari localStorage.
   * 
   * Validasi typeof window dilakukan karena:
   * - localStorage hanya tersedia di browser
   * - mencegah error saat SSR/server-side rendering
   */
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  return {

    headers: {

      // Pertahankan header lama
      ...headers,

      /**
       * Inject bearer token.
       * 
       * Format:
       * Authorization: Bearer xxx
       */
      authorization:
        token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * WEBSOCKET CLIENT
 * 
 * Digunakan untuk:
 * - GraphQL Subscription
 * - Realtime update
 * 
 */

/**
 * Variable global websocket client.
 */
let wsClient: Client | null = null;

/**
 * WebSocket hanya dibuat di browser/client-side.
 */
if (typeof window !== 'undefined') {

  /**
   * Endpoint websocket dari env.
   */
  const wsEndpoint =
    process.env.NEXT_PUBLIC_WS_ENDPOINT;

  /**
   * Warning jika endpoint websocket tidak tersedia.
   */
  if (!wsEndpoint) {

    console.warn(

      '[Apollo] NEXT_PUBLIC_WS_ENDPOINT is not defined. ' +

      'WebSocket subscriptions will not work. ' +

      'Please check your .env.local file.'
    );

  } else {

    /**
     * EXPONENTIAL BACKOFF RETRY
     * 
     * Digunakan untuk:
     * - reconnect websocket
     * - menghindari spam reconnect
     * - mengurangi beban server/network
     */

    let retryCount = 0;

    /**
     * Menghasilkan delay retry bertingkat:
     * 
     * 1s → 2s → 4s → 8s → max 30s
     */
    const getRetryDelay = () => {

      const delay = Math.min(
        1000 * Math.pow(2, retryCount),
        30_000
      );

      retryCount += 1;

      return delay;
    };

    /**
     * CREATE WEBSOCKET CLIENT
     */
    wsClient = createClient({

      /**
       * URL websocket endpoint.
       */
      url: wsEndpoint,

      /**
       * AUTO RETRY CONNECTION
       * 
       * Mengaktifkan reconnect otomatis.
       */
      shouldRetry: () => true,

      /**
       * Maksimal retry reconnect.
       */
      retryAttempts: 5,

      /**
       * Keep connection tetap hidup
       * setiap 10 detik.
       */
      keepAlive: 10_000,

      /**
       * WEBSOCKET EVENT LISTENER
       */
      on: {

        /**
         * Saat websocket mulai connect.
         */
        connecting: () => {

          if (process.env.NODE_ENV === 'development') {

            console.log('🔌 [WS] Connecting...');
          }
        },

        /**
         * Saat websocket berhasil connect.
         */
        connected: () => {

          /**
           * Reset retry counter.
           */
          retryCount = 0;

          /**
           * Hapus error log flag.
           */
          sessionStorage.removeItem('ws_error_logged');

          if (process.env.NODE_ENV === 'development') {

            console.log('✅ [WS] Connected!');
          }
        },

        /**
         * Saat websocket terputus.
         */
        closed: () => {

          if (process.env.NODE_ENV === 'development') {

            console.warn('⚠️  [WS] Connection closed');
          }
        },

        /**
         * Saat websocket mengalami error.
         */
        error: (error) => {

          if (process.env.NODE_ENV === 'development') {

            /**
             * Hindari spam log error berulang.
             */
            const errorKey = 'ws_error_logged';

            if (!sessionStorage.getItem(errorKey)) {

              /**
               * Hitung retry delay.
               */
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

      /**
       * CONNECTION PARAMS
       * 
       * Authorization token untuk websocket.
       * 
       * Dikirim saat koneksi websocket dibuat.
       */
      connectionParams: () => {

        const token =
          localStorage.getItem('token');

        return {

          Authorization:
            token ? `Bearer ${token}` : '',
        };
      },
    });
  }
}

/**
 * WEBSOCKET LINK
 * 
 * Link khusus untuk subscription.
 */
const wsLink =
  wsClient
    ? new GraphQLWsLink(wsClient)
    : null;

/**
 * SPLIT LINK
 * 
 * Digunakan untuk memisahkan:
 * 
 * Subscription:
 * → WebSocket
 * 
 * Query & Mutation:
 * → HTTP + Auth
 */
const splitLink = wsLink

  ? split(

      /**
       * Mengecek jenis operation GraphQL.
       */
      ({ query }) => {

        const definition =
          getMainDefinition(query);

        return (

          definition.kind === 'OperationDefinition' &&

          definition.operation === 'subscription'
        );
      },

      /**
       * Jika subscription:
       * gunakan websocket.
       */
      wsLink,

      /**
       * Selain subscription:
       * gunakan HTTP + Auth.
       */
      authLink.concat(httpLink)
    )

  : authLink.concat(httpLink);

/**
 * APOLLO CLIENT INSTANCE
 * 
 * Instance utama Apollo Client.
 */
export const apolloClient =
  new ApolloClient({

    /**
     * Link utama aplikasi.
     */
    link: splitLink,

    /**
     * Cache memory Apollo.
     */
    cache: new InMemoryCache(),
  });

/**
 * CLOSE WEBSOCKET CONNECTION
 * 
 * Digunakan saat:
 * - logout
 * - page unload
 * - cleanup session
 */
export async function closeApolloWebSocket() {

  /**
   * Hindari eksekusi di server.
   */
  if (
    typeof window === 'undefined' ||
    !wsClient
  ) return;

  try {

    /**
     * Tutup websocket connection.
     */
    await wsClient.dispose();

  } catch (error) {

    /**
     * Error logging development only.
     */
    if (process.env.NODE_ENV === 'development') {

      console.error(
        '❌ [WS] Error closing WebSocket:',
        error
      );
    }
  }
}

/**
 * RESET APOLLO CACHE
 * 
 * Digunakan saat:
 * - logout
 * - clear session
 * - reset user state
 */
export async function resetApolloCache() {

  try {

    /**
     * Hapus seluruh Apollo cache.
     */
    await apolloClient.clearStore();

  } catch (error) {

    /**
     * Error logging development only.
     */
    if (process.env.NODE_ENV === 'development') {

      console.error(
        '❌ Error clearing Apollo cache:',
        error
      );
    }
  }
}