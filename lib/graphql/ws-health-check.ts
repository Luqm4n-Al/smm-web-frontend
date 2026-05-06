/**
 * WebSocket Health Check Utility
 * 
 * Digunakan untuk:
 * - Test koneksi WS ke backend
 * - Verify token authentication
 * - Debug connection issues
 * - Monitor connection status
 */

export interface WSHealthCheckResult {
  isConnected: boolean;
  endpoint: string | undefined;
  hasToken: boolean;
  wsClientActive: boolean;
  lastConnectionTime?: Date;
  lastError?: string;
  debugInfo: {
    envConfigured: boolean;
    tokenValid: boolean;
    clientReady: boolean;
    nodeEnv: string;
  };
}

/**
 * Perform comprehensive WebSocket health check
 * 
 * @example
 * import { checkWebSocketHealth } from '@/lib/graphql/ws-health-check';
 * 
 * const health = await checkWebSocketHealth();
 * console.log(health);
 * 
 * if (!health.isConnected) {
 *   console.error('WS not connected:', health.lastError);
 * }
 */
export async function checkWebSocketHealth(): Promise<WSHealthCheckResult> {
  if (typeof window === 'undefined') {
    return {
      isConnected: false,
      endpoint: undefined,
      hasToken: false,
      wsClientActive: false,
      lastError: 'Server-side: WebSocket health check tidak tersedia',
      debugInfo: {
        envConfigured: false,
        tokenValid: false,
        clientReady: false,
        nodeEnv: 'server',
      },
    };
  }

  const endpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  const token = localStorage.getItem('token');
  const wsClient = (globalThis as any).__apollo_ws_client;

  // Try to get wsClient from Apollo
  let wsConnected = false;
  let lastError: string | undefined;

  try {
    // Check if GraphQL-WS client is available via window
    if (typeof (window as any).__apollo_ws_status !== 'undefined') {
      wsConnected = (window as any).__apollo_ws_status === 'connected';
    }
  } catch (e) {
    lastError = String(e);
  }

  const result: WSHealthCheckResult = {
    isConnected: wsConnected,
    endpoint,
    hasToken: !!token,
    wsClientActive: !!wsClient,
    lastError,
    debugInfo: {
      envConfigured: !!endpoint,
      tokenValid: token ? token.length > 10 : false,
      clientReady: !!wsClient,
      nodeEnv: process.env.NODE_ENV || 'unknown',
    },
  };

  return result;
}

/**
 * Log WebSocket health status ke console dengan formatting
 * 
 * @example
 * import { logWebSocketHealth } from '@/lib/graphql/ws-health-check';
 * 
 * await logWebSocketHealth();
 */
export async function logWebSocketHealth(): Promise<void> {
  const health = await checkWebSocketHealth();

  console.group('🔍 WebSocket Health Check');
  console.log(`Endpoint: ${health.endpoint || '❌ NOT CONFIGURED'}`);
  console.log(`Token: ${health.hasToken ? '✅ Present' : '❌ Missing'}`);
  console.log(`Connected: ${health.isConnected ? '✅ Yes' : '⚠️  No'}`);
  console.log(`WS Client: ${health.wsClientActive ? '✅ Active' : '⚠️  Inactive'}`);

  if (health.lastError) {
    console.error(`Last Error: ${health.lastError}`);
  }

  console.group('Debug Info');
  console.log('Env Configured:', health.debugInfo.envConfigured);
  console.log('Token Valid:', health.debugInfo.tokenValid);
  console.log('Client Ready:', health.debugInfo.clientReady);
  console.log('Node Env:', health.debugInfo.nodeEnv);
  console.groupEnd();

  // Recommendations
  if (!health.isConnected) {
    console.group('💡 Troubleshooting Tips:');
    if (!health.debugInfo.envConfigured) {
      console.error('1. NEXT_PUBLIC_WS_ENDPOINT is not set in .env.local');
    }
    if (!health.debugInfo.tokenValid) {
      console.error('2. Token is missing or invalid - try logging in again');
    }
    if (!health.wsClientActive) {
      console.error('3. WebSocket client not ready - page might still be loading');
    }
    console.error('4. Check network tab in DevTools for failed WS upgrade');
    console.error('5. Verify backend is running at:', health.endpoint);
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Simple connectivity test untuk WS endpoint
 * 
 * ⚠️ NOTE: Browser tidak allow direct WebSocket test tanpa protocol upgrade
 * Ini adalah informational check saja
 * 
 * @example
 * const canReach = await testWebSocketEndpoint();
 * console.log('Can reach WS:', canReach);
 */
export async function testWebSocketEndpoint(): Promise<boolean> {
  const endpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  if (!endpoint) return false;

  try {
    // Convert WS endpoint to HTTP for HTTP test
    const httpEndpoint = endpoint.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
    
    const response = await fetch(httpEndpoint, {
      method: 'OPTIONS',
      mode: 'no-cors',
    });
    
    return response.ok || response.status === 0; // 0 means no-cors succeeded
  } catch (error) {
    console.error('Endpoint test failed:', error);
    return false;
  }
}
