/**
 * Custom hook untuk tracking subscription lifecycle dengan debugging
 * 
 * Digunakan untuk monitor ketika subscription:
 * - Subscribe (connecting)
 * - Receive data
 * - Error
 * - Complete/Unsubscribe
 * 
 * Berguna untuk diagnose "sudden unsubscribe" issues
 */

import { useEffect } from 'react';

interface SubscriptionDebugOptions {
  name: string; // Nama subscription untuk logging
  enabled?: boolean; // Enable/disable debugging
}

/**
 * Hook untuk debug subscription lifecycle
 * 
 * @param subscriptionName - Nama subscription (e.g., "NotificationSubscription")
 * @param options - Debug options
 * 
 * @example
 * export function MyComponent() {
 *   useSubscriptionDebug('NotificationSubscription', { enabled: true });
 *   
 *   const { data } = useSubscription(gql`...`);
 *   // Akan auto-log semua subscription events
 * }
 */
export function useSubscriptionDebug(
  subscriptionName: string,
  options: Partial<SubscriptionDebugOptions> = { enabled: true }
) {
  const { enabled = true } = options as Required<SubscriptionDebugOptions>;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const debugName = `[${subscriptionName}]`;

    // Log subscription mounted
    console.log(`📡 ${debugName} Subscription hook mounted`);

    // Monitor WebSocket connection
    const monitorWS = setInterval(() => {
      if (typeof window !== 'undefined') {
        // Check if WebSocket is connected by trying to access Apollo cache
        try {
          const wsStatus = (window as unknown as Record<string, unknown>)?.__apollo_ws_status;
          console.log(`🔌 ${debugName} WS Status:`, wsStatus || 'connected');
        } catch {
          // Silent - just for monitoring
        }
      }
    }, 30_000); // Every 30 seconds

    // Cleanup function untuk log ketika unmount
    return () => {
      clearInterval(monitorWS);
      console.log(`🔌 ${debugName} Subscription hook unmounted (or component destroyed)`);
    };
  }, [subscriptionName, enabled]);
}

/**
 * Hook untuk monitor observable subscription dengan granular control
 * 
 * @example
 * const subscription = useSubscription(NOTIFICATION_SUBSCRIPTION);
 * useObservableSubscriptionDebug(subscription, 'NotificationSubscription');
 */
export function useObservableSubscriptionDebug(
  subscriptionResult: { data?: unknown; loading?: boolean; error?: Error; called?: boolean },
  subscriptionName: string
) {
  const debugName = `[${subscriptionName}]`;

  useEffect(() => {
    const { data, loading, error, called } = subscriptionResult;

    if (called) {
      if (loading) {
        console.log(`⏳ ${debugName} Loading subscription data...`);
      }

      if (data) {
        console.log(`✅ ${debugName} Data received:`, data);
      }

      if (error) {
        console.error(`❌ ${debugName} Subscription error:`, error.message);
        
        // Diagnosis untuk common subscription errors
        if (error.message.includes('unauthorized') || error.message.includes('401')) {
          console.error(`🔐 ${debugName} Auth error - token might be invalid`);
          console.info(`💡 ${debugName} Try: Re-login atau refresh token`);
        }
        
        if (error.message.includes('timeout')) {
          console.error(`⏱️ ${debugName} Timeout error - server not responding`);
          console.info(`💡 ${debugName} Try: Check server status atau retry manually`);
        }
        
        if (error.message.includes('network')) {
          console.error(`🌐 ${debugName} Network error`);
          console.info(`💡 ${debugName} Try: Check internet connection`);
        }
      }
    }
  }, [subscriptionResult, debugName]);
}

/**
 * Utility untuk log subscription state changes
 * Gunakan di component yang pakai subscription
 * 
 * @example
 * function NotificationComponent() {
 *   const { data, loading, error } = useSubscription(NOTIFICATION_SUBSCRIPTION);
 *   
 *   logSubscriptionState('Notification', { data, loading, error });
 *   
 *   return ...
 * }
 */
export function logSubscriptionState(
  name: string,
  state: {
    data?: unknown;
    loading?: boolean;
    error?: Error;
    networkStatus?: number;
  }
) {
  const debugName = `📡 [${name}]`;

  console.group(`${debugName} State Check`);
  console.log('⏳ Loading:', state.loading);
  console.log('📦 Data available:', !!state.data);
  console.log('❌ Error:', state.error?.message || 'none');
  console.log('🌐 Network Status:', state.networkStatus);
  console.groupEnd();
}

/**
 * Monitor token changes dan trigger reconnection
 * Gunakan ini jika subscription disconnect setelah token berubah
 * 
 * @example
 * function MyComponent() {
 *   useTokenChangeMonitor('Subscription', () => {
 *     // Triggered ketika token berubah
 *     // Bisa refresh subscription di sini
 *   });
 * }
 */
export function useTokenChangeMonitor(
  componentName: string,
  onTokenChanged?: () => void
) {
  useEffect(() => {
    const debugName = `🔐 [${componentName}]`;
    let lastToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const interval = setInterval(() => {
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (lastToken !== currentToken) {
        if (!currentToken) {
          console.log(`${debugName} Token cleared (user logged out)`);
        } else {
          console.log(`${debugName} Token changed - subscription might need refresh`);
        }
        
        if (onTokenChanged) {
          onTokenChanged();
        }
        
        lastToken = currentToken;
      }
    }, 5_000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [componentName, onTokenChanged]);
}

/**
 * Diagnostic helper - check WebSocket connection status dan Authorization header
 * 
 * @returns Status object dengan connection info dan auth header
 * 
 * @example
 * const wsStatus = getWebSocketStatus();
 * console.log('WS Connected:', wsStatus.connected);
 * console.log('WS URL:', wsStatus.url);
 * console.log('Authorization Header:', wsStatus.authHeader);
 */
export function getWebSocketStatus() {
  if (typeof window === 'undefined') {
    return {
      available: false,
      connected: false,
      url: null,
      wsReadyState: null,
      readyStateLabel: null,
      authHeader: '❌ Running on server',
      error: 'Running on server',
    };
  }

  try {
    const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Build Authorization header
    const authHeader = token ? `Bearer ${token.substring(0, 20)}...` : '❌ No token in localStorage';

    // Try to get actual WebSocket readyState dari Apollo Client
    // Note: Apollo graphql-ws client hides the actual WebSocket instance
    // So we return null for connected if we can't access it
    return {
      available: true,
      connected: null, // Apollo WS lib doesn't expose readyState directly
      url: wsEndpoint,
      wsReadyState: null,
      readyStateLabel: null,
      authHeader: authHeader,
      tokenStatus: {
        present: !!token,
        valid: token ? token.split('.').length === 3 : false,
        preview: token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : 'none',
      },
    };
  } catch (error) {
    return {
      available: true,
      connected: null,
      url: process.env.NEXT_PUBLIC_WS_ENDPOINT,
      wsReadyState: null,
      readyStateLabel: null,
      authHeader: '❌ Error getting auth header',
      error: (error as Error).message,
    };
  }
}



/**
 * Log Authorization header status dan token details
 * Gunakan untuk diagnose auth issues
 * 
 * @example
 * logAuthorizationHeader('AnalyticsSubscription');
 */
export function logAuthorizationHeader(componentName: string) {
  if (typeof window === 'undefined') {
    console.log(`🔐 [${componentName}] Running on server - cannot check auth header`);
    return;
  }

  const token = localStorage.getItem('token');
  const debugName = `🔐 [${componentName}]`;

  console.group(`${debugName} Authorization Header Status`);

  if (!token) {
    console.error('❌ No token in localStorage');
    console.log('💡 Steps to fix:');
    console.log('  1. Check if you logged in');
    console.log('  2. Check TokenManager is mounted');
    console.log('  3. Run: localStorage.getItem("token")');
  } else {
    // Analyze token
    const parts = token.split('.');
    const isValidJWT = parts.length === 3;

    console.log('✅ Token present in localStorage');
    console.log(`📊 Format: ${isValidJWT ? '✅ Valid JWT' : '❌ Invalid JWT'} (parts: ${parts.length})`);
    console.log(`📋 Token preview: ${token.substring(0, 30)}...${token.substring(token.length - 30)}`);
    console.log(`📦 Token size: ${token.length} bytes`);

    if (isValidJWT) {
      try {
        // Decode payload
        const payload = JSON.parse(atob(parts[1]));
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expDate < now;

        console.log('📋 Token payload:');
        console.table({
          'Subject': payload.sub || 'unknown',
          'Issued At': new Date(payload.iat * 1000).toLocaleString(),
          'Expires At': expDate.toLocaleString(),
          'Status': isExpired ? '⏰ EXPIRED' : '✅ Valid',
          'Time Left': !isExpired ? Math.round((expDate.getTime() - now.getTime()) / 1000 / 60) + ' minutes' : 'N/A',
        });

        if (isExpired) {
          console.error('🔐 Token EXPIRED - need to re-login');
        }
      } catch {
        console.error('❌ Could not decode token: Invalid JWT format');
      }
    }

    // Authorization header that will be sent
    const authHeader = `Bearer ${token}`;
    console.log('📤 Authorization header to be sent:');
    console.log(`   ${authHeader.substring(0, 50)}...`);
  }

  console.groupEnd();
}

/**
 * Comprehensive auth check - logs everything needed for debugging
 * 
 * @example
 * performAuthCheck('AnalyticsSubscription');
 * // Logs: token status, localStorage, WS endpoint, auth header
 */
export function performAuthCheck(componentName: string) {
  if (typeof window === 'undefined') {
    console.log(`✅ [${componentName}] Server-side rendering - skip auth check`);
    return;
  }

  const debugName = `🔐 [${componentName}]`;

  console.group(`${debugName} Comprehensive Auth Check`);

  // 1. Check token in localStorage
  const token = localStorage.getItem('token');
  console.log('1️⃣ Token in localStorage:', token ? '✅ Found' : '❌ Missing');

  // 2. Check token format
  if (token) {
    const isValidJWT = token.split('.').length === 3;
    console.log('2️⃣ Token format:', isValidJWT ? '✅ Valid JWT' : '❌ Invalid JWT');

    // 3. Check token expiration
    if (isValidJWT) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = Date.now() > (payload.exp as number) * 1000;
        console.log('3️⃣ Token expiration:', isExpired ? '⏰ EXPIRED' : '✅ Valid');
      } catch {
        console.log('3️⃣ Token expiration: ❌ Cannot decode');
      }
    }
  }

  // 4. Check WS endpoint
  const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  console.log('4️⃣ WS endpoint:', wsEndpoint ? `✅ ${wsEndpoint}` : '❌ Not configured');

  // 5. Check auth header will be built correctly
  const authHeader = token ? `Bearer ${token}` : 'none';
  console.log('5️⃣ Auth header:', authHeader ? '✅ Will be sent' : '❌ Not available');

  // 6. Check GraphQL endpoint (http)
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  console.log('6️⃣ GraphQL endpoint:', graphqlEndpoint ? `✅ ${graphqlEndpoint}` : '❌ Not configured');

  console.groupEnd();

  // Summary
  const allChecksPass =
    token &&
    token.split('.').length === 3 &&
    Date.now() <= JSON.parse(atob(token.split('.')[1])).exp * 1000 &&
    wsEndpoint &&
    graphqlEndpoint;

  if (allChecksPass) {
    console.log(`✅ ${debugName} All auth checks PASSED - Ready to subscribe`);
  } else {
    console.error(`❌ ${debugName} Some auth checks FAILED - Check above`);
  }
}
