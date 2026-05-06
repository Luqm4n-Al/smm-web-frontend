/**
 * Example: WebSocket Health Check Component
 * 
 * Gunakan sebagai debugging dashboard untuk monitor WebSocket status
 */

'use client';

import { useEffect, useState } from 'react';
import { checkWebSocketHealth, logWebSocketHealth, type WSHealthCheckResult } from '@/lib/graphql/ws-health-check';

export function DebugWebSocketStatus() {
  const [health, setHealth] = useState<WSHealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await checkWebSocketHealth();
      setHealth(result);
      setLastCheck(new Date());
      
      // Also log to console for inspection
      console.log('🔍 WebSocket Health Check Result:', result);
    } catch (error) {
      console.error('Error running health check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogToConsole = async () => {
    await logWebSocketHealth();
  };

  useEffect(() => {
    runHealthCheck();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(runHealthCheck, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!health || isLoading) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">🔄 Checking WebSocket status...</p>
      </div>
    );
  }

  const isHealthy = health.isConnected && health.hasToken && health.debugInfo.envConfigured;

  return (
    <div className={`p-4 border rounded-lg ${
      isHealthy 
        ? 'bg-green-50 border-green-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {isHealthy ? '✅' : '⚠️'} WebSocket Status
          </h3>
          <div className="text-xs text-gray-500">
            Last check: {lastCheck?.toLocaleTimeString()}
          </div>
        </div>

        {/* Status Items */}
        <div className="grid grid-cols-2 gap-3">
          {/* Endpoint */}
          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600">Endpoint</div>
            <div className="text-sm font-mono text-gray-900 truncate">
              {health.endpoint || '❌ Not set'}
            </div>
          </div>

          {/* Connection */}
          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600">Connected</div>
            <div className={`text-sm font-semibold ${
              health.isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {health.isConnected ? '✅ Yes' : '❌ No'}
            </div>
          </div>

          {/* Token */}
          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600">Token</div>
            <div className={`text-sm font-semibold ${
              health.hasToken ? 'text-green-600' : 'text-red-600'
            }`}>
              {health.hasToken ? '✅ Present' : '❌ Missing'}
            </div>
          </div>

          {/* WS Client */}
          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600">WS Client</div>
            <div className={`text-sm font-semibold ${
              health.wsClientActive ? 'text-green-600' : 'text-red-600'
            }`}>
              {health.wsClientActive ? '✅ Active' : '⚠️ Inactive'}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <details className="p-2 bg-white rounded border border-gray-200">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            📋 Debug Info
          </summary>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div>Env Configured: {health.debugInfo.envConfigured ? '✅' : '❌'}</div>
            <div>Token Valid: {health.debugInfo.tokenValid ? '✅' : '❌'}</div>
            <div>Client Ready: {health.debugInfo.clientReady ? '✅' : '❌'}</div>
            <div>Node Env: {health.debugInfo.nodeEnv}</div>
          </div>
        </details>

        {/* Error Display */}
        {health.lastError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <div className="text-xs text-red-700">
              <strong>Last Error:</strong> {health.lastError}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleLogToConsole}
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            🖥️ Log to Console
          </button>
        </div>

        {/* Troubleshooting Tips */}
        {!isHealthy && (
          <div className="p-2 bg-orange-50 border border-orange-200 rounded">
            <div className="text-xs font-semibold text-orange-900 mb-1">💡 Troubleshooting:</div>
            <ul className="text-xs text-orange-800 space-y-1 list-disc list-inside">
              {!health.debugInfo.envConfigured && (
                <li>NEXT_PUBLIC_WS_ENDPOINT not configured in .env.local</li>
              )}
              {!health.hasToken && (
                <li>Token missing - try logging in again</li>
              )}
              {!health.isConnected && health.debugInfo.envConfigured && health.hasToken && (
                <li>Cannot connect to backend - check if running at {health.endpoint}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Example: How to use this component
 * 
 * In your dashboard or debug page:
 * 
 * import { DebugWebSocketStatus } from '@/components/DebugWebSocketStatus';
 * 
 * export function DebugPage() {
 *   return (
 *     <div className="p-6 space-y-4">
 *       <h1>Debug Dashboard</h1>
 *       <DebugWebSocketStatus />
 *     </div>
 *   );
 * }
 */
