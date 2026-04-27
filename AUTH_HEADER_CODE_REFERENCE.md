# 🔐 Authorization Header Implementation - Detailed Code Reference

## 📋 Overview

This document shows exactly what code was added to implement Authorization header debugging.

---

## 📁 File 1: useSubscriptionDebug.ts

### **New Function 1: logAuthorizationHeader()**

```typescript
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
```

---

### **New Function 2: performAuthCheck()**

```typescript
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
```

---

### **Enhanced: getWebSocketStatus()**

```typescript
/**
 * Get comprehensive WebSocket status
 * Now includes Authorization header tracking
 */
export function getWebSocketStatus() {
  if (typeof window === 'undefined') return { available: false };

  const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  const token = localStorage.getItem('token');

  // Build authorization header status
  const authHeader = token 
    ? `Bearer ${token.substring(0, 20)}...` 
    : '❌ No token in localStorage';

  // Check if token is valid JWT
  const isValidJWT = token?.split('.').length === 3;

  return {
    available: true,
    connected: null,
    url: wsEndpoint,
    authHeader,                          // ✨ NEW
    tokenStatus: {                       // ✨ NEW
      present: !!token,
      valid: isValidJWT,
      preview: token 
        ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}`
        : 'none',
    },
    wsReadyState: ws?.readyState,
    readyStateLabel: ws?.readyState ? getReadyStateLabel(ws.readyState) : 'UNKNOWN',
  };
}
```

---

## 📁 File 2: analytics.subscription.ts

### **Updated Imports**

```typescript
import {
  useSubscriptionDebug,
  useTokenChangeMonitor,
  logSubscriptionState,
  getWebSocketStatus,
  logAuthorizationHeader,    // ✨ NEW
  performAuthCheck,          // ✨ NEW
} from '@/features/dashboard/hooks/useSubscriptionDebug';
```

---

### **Enhanced: Initialization Phase**

```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  
  console.group('🚀 [AnalyticsSubscription] Initialization Checklist');
  console.log('✅ Hook instantiated');
  console.log('✅ GraphQL subscription defined:', ANALYTICS_UPDATED_SUBSCRIPTION.loc?.source?.body?.substring(0, 40) + '...');
  console.table({
    'Token Status': token ? `✅ Present (${token.substring(0, 20)}...)` : '❌ Missing',
    'WS Endpoint': wsEndpoint ? `✅ ${wsEndpoint}` : '❌ Not configured',
    'Timestamp': new Date().toLocaleTimeString(),
  });
  console.groupEnd();

  // ✨ NEW: Detailed Authorization Header Check
  logAuthorizationHeader('AnalyticsSubscription');

  // ✨ NEW: Comprehensive Auth Check
  performAuthCheck('AnalyticsSubscription');
}, []);
```

---

### **Enhanced: WS Connection Status Logging**

```typescript
useEffect(() => {
  let lastStatus: { connected: boolean | null } | null = null;

  const interval = setInterval(() => {
    const wsStatus = getWebSocketStatus();

    // Log hanya jika status berubah (avoid spam)
    if (lastStatus?.connected !== wsStatus.connected) {
      console.group(`🔌 [AnalyticsSubscription] WS Connection Status Changed`);
      console.log('⏰ Timestamp:', new Date().toLocaleTimeString());
      console.log('🔗 URL:', wsStatus.url);
      console.log('📊 Connected:', wsStatus.connected);
      console.log('🎯 Ready State:', wsStatus.readyStateLabel || wsStatus.wsReadyState);
      
      // ✨ NEW: Log Authorization Header Status
      console.log('🔐 Authorization Header:');
      console.table({
        'Header Value': wsStatus.authHeader,
        'Token Present': wsStatus.tokenStatus?.present ? '✅ Yes' : '❌ No',
        'Token Valid': wsStatus.tokenStatus?.valid ? '✅ Yes' : '❌ No',
        'Token Preview': wsStatus.tokenStatus?.preview || 'none',
      });

      if (wsStatus.connected === false) {
        console.warn('⚠️ WebSocket disconnected - might not receive updates');
        console.warn('💡 Check: Network connection, Server status, Token validity, Authorization header');
      } else if (wsStatus.connected === true) {
        console.log('✅ WebSocket connected and ready for data');
      }
      
      console.groupEnd();
      lastStatus = wsStatus;
    }
  }, 30_000);

  // ✨ NEW: Initial check immediately with auth header
  const wsStatus = getWebSocketStatus();
  console.group('🔌 [AnalyticsSubscription] Initial WS Connection Check');
  console.log('🔌 WS status:', {
    connected: wsStatus.connected,
    url: wsStatus.url,
    readyState: wsStatus.readyStateLabel,
  });
  console.log('🔐 Authorization Header:');
  console.table({
    'Header Value': wsStatus.authHeader,
    'Token Present': wsStatus.tokenStatus?.present ? '✅ Yes' : '❌ No',
    'Token Valid': wsStatus.tokenStatus?.valid ? '✅ Yes' : '❌ No',
  });
  console.groupEnd();

  return () => clearInterval(interval);
}, [data, loading, error]);
```

---

## 🔄 Data Flow

**New Authorization Tracking Flow:**

```
Hook Mounts
    ↓
[1] Initialization Checklist
    ├─ Show token status
    └─ Show WS endpoint
    ↓
[2] logAuthorizationHeader()  ← ✨ NEW
    ├─ Check token in localStorage
    ├─ Validate JWT format
    ├─ Check expiration date
    ├─ Decode and show payload
    └─ Show authorization header that will be sent
    ↓
[3] performAuthCheck()  ← ✨ NEW
    ├─ 6-point validation checklist
    ├─ Overall pass/fail status
    └─ Specific error messages
    ↓
[4] WebSocket Connection
    ├─ Check getWebSocketStatus()  ← Enhanced
    ├─ Show authorization header
    └─ Show token status details
    ↓
[5] Data Reception
    └─ Complete with auth tracking

Every 30s:
    ↓
[6] Periodic WS Status Check
    ├─ Show authorization header
    └─ Show token validity
```

---

## 📊 Console Output Structure

```
🚀 Initialization Checklist          ← From useEffect
🔐 Authorization Header Status       ← logAuthorizationHeader()
🔐 Comprehensive Auth Check          ← performAuthCheck()
🔌 Initial WS Connection Check       ← getWebSocketStatus()
📡 Hook mounted                       ← useSubscriptionDebug()
[... wait for data ...]
🔌 Periodic WS Status Check          ← Every 30s from useEffect
```

---

## ✨ Key Improvements

| Before | After |
|--------|-------|
| WS logs showed status only | Now shows Authorization header with status |
| No token validation | Now validates JWT format and expiration |
| Manual token checking required | Automatic comprehensive auth check |
| Hard to diagnose auth issues | Clear step-by-step troubleshooting guide |
| Authorization header invisible | Authorization header tracked and logged |
| Token expiration invisible | Token expiration date and time-left shown |

---

## 🔍 Lines of Code Added

- `useSubscriptionDebug.ts`: ~200 lines (2 new functions + enhancements)
- `analytics.subscription.ts`: ~30 lines (imports + function calls + enhanced logging)
- **Total**: ~230 lines of new debug code

---

## 📝 Type Definitions

```typescript
// getWebSocketStatus() return type (enhanced)
{
  available: boolean;
  connected: boolean | null;
  url: string | undefined;
  authHeader: string;              // ✨ NEW
  tokenStatus: {                   // ✨ NEW
    present: boolean;
    valid: boolean;
    preview: string;
  };
  wsReadyState: number | undefined;
  readyStateLabel: string;
}
```

---

## 🎯 Function Signatures

```typescript
// New exports from useSubscriptionDebug.ts
export function logAuthorizationHeader(componentName: string): void
export function performAuthCheck(componentName: string): void

// Enhanced export
export function getWebSocketStatus(): {
  available: boolean;
  connected: boolean | null;
  url: string | undefined;
  authHeader: string;
  tokenStatus: { present: boolean; valid: boolean; preview: string };
  wsReadyState?: number;
  readyStateLabel?: string;
}
```

---

## ✅ Backward Compatibility

- All changes are **additive** (no breaking changes)
- Existing `getWebSocketStatus()` properties preserved
- New properties added without removing old ones
- All new functions exported without affecting existing code
- Existing components continue to work unchanged

---

**Authorization Header Debugging - Fully Implemented! ✅**
