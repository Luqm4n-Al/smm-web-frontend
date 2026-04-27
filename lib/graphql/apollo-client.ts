import { ApolloClient, InMemoryCache, split, createHttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Buat SubscriptionClient terpisah supaya bisa di-monitor
const subscriptionClient = typeof window !== 'undefined'
  ? new SubscriptionClient(
      process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://192.168.100.114:8080/query',
      {
        reconnect: true,
        reconnectionAttempts: 3, // batasi retry
        timeout: 30000,
        connectionParams: () => {
          const token = localStorage.getItem('token');
          return {
            Authorization: token ? `Bearer ${token}` : '',
          };
        },
        connectionCallback: (error) => {
          if (error) {
            console.error('❌ [WS] Connection failed:', error);
          } else {
            console.log('✅ [WS] Connection established');
          }
        },
      }
    )
  : null;

// Monitor lifecycle events
if (subscriptionClient) {
  subscriptionClient.onConnecting(() => console.log('🔌 [WS] Connecting...'));
  subscriptionClient.onConnected(() => console.log('✅ [WS] Connected!'));
  subscriptionClient.onReconnecting(() => console.log('🔄 [WS] Reconnecting...'));
  subscriptionClient.onReconnected(() => console.log('✅ [WS] Reconnected!'));
  subscriptionClient.onDisconnected(() => console.log('🔴 [WS] Disconnected'));
  subscriptionClient.onError((error) => console.error('❌ [WS] Error:', error));
}

const wsLink = subscriptionClient ? new WebSocketLink(subscriptionClient) : null;

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
      authLink.concat(httpLink),
    )
  : authLink.concat(httpLink);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});