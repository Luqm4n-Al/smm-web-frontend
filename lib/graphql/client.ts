import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

/**
 * Auth link untuk attach Authorization header ke setiap GraphQL request
 * Read token dari localStorage setiap kali ada request (bukan cached)
 */
const authLink = setContext((_, { headers }) => {
  // Read token dari localStorage pada waktu request (bukan di load time)
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    
    // Debug logging
    if (token) {
      console.log('🔐 [Apollo authLink] Token found in localStorage');
    } else {
      console.warn('⚠️ [Apollo authLink] No token in localStorage');
    }
  }

  return {
    headers: {
      ...headers,
      // Set authorization header jika token ada
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});