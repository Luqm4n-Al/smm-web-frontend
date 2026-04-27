# WebSocket GraphQL Subscription Debugging Guide

## 🐛 Common Issues & Solutions

### Issue 1: Subscription Connects Then Immediately Disconnects

**Symptoms:**
```
✅ [WS] Connected successfully
🔴 [WS] Connection closed (code: 1006, reason: abnormal closure)
```

**Likely Causes:**
1. **Token expired or invalid** → Check `localStorage.getItem('token')`
2. **Server rejecting auth** → Check server logs for auth errors
3. **Network timeout** → Server might be slow to respond

**How to Debug:**
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));

// Check if token is valid JWT
const token = localStorage.getItem('token');
if (token?.split('.').length === 3) {
  console.log('✅ Token format OK (JWT)');
} else {
  console.error('❌ Invalid token format');
}
```

**Fix:**
```javascript
// Re-login to get fresh token
window.location.href = '/login';
```

---

### Issue 2: Subscription Data Stops Coming After Few Minutes

**Symptoms:**
```
📨 [WS] Data received: {...} // Works for a while
// Then nothing, connection seems open but no data
```

**Likely Causes:**
1. **Connection dead but not closed** → Need keep-alive fix
2. **Server-side error** → Check server logs
3. **Browser tab backgrounded** → Some browsers throttle WebSockets

**How to Debug:**
```javascript
// Monitor keep-alive pings
// Already implemented with keepalive: 10_000 in apollo-client.ts
console.log('[WS] Should see keep-alive every ~10 seconds');

// Check if tab is backgrounded
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.warn('⚠️ [WS] Tab backgrounded - WebSocket may be throttled');
  } else {
    console.log('✅ [WS] Tab foregrounded - WebSocket should resume');
  }
});
```

**Fix:**
```javascript
// Force reconnect
apolloClient.cache.reset();
// Or refetch subscription manually
```

---

### Issue 3: "Sudden Unsubscribe" - Data Was Coming, Then Stopped

**Symptoms:**
```
✅ [WS] Connected successfully
📨 [WS] Data received: {...}
📨 [WS] Data received: {...}
📨 [WS] Data received: {...}
// ... then nothing

// No "Connection closed" or error - just stops
```

**Likely Causes:**
1. **Token refreshed but subscription not updated** → Need re-subscription
2. **User logged out in another tab** → Token became invalid
3. **Server silently closing connection** → Check server timeouts
4. **Subscription completed on server** → Expected behavior

**How to Debug:**
```javascript
// Use debug hook to monitor token changes
import { useTokenChangeMonitor } from '@/features/dashboard/hooks/useSubscriptionDebug';

function MyComponent() {
  useTokenChangeMonitor('MySubscription', () => {
    console.log('🔐 Token changed! Subscription might need refresh');
    // Manually refresh subscription here
  });
  
  return ...
}
```

**Fix:**
See "How to Use Subscription Debug" section below.

---

## 🔧 Improved WebSocket Configuration

### What Changed

**Old Configuration Issues:**
- ❌ No keep-alive mechanism
- ❌ Limited reconnection strategy
- ❌ Missing detailed error diagnosis
- ❌ No token refresh on reconnect

**New Configuration Features:**
- ✅ Keep-alive pings every 10 seconds
- ✅ Automatic reconnection with exponential backoff
- ✅ Detailed error messages with diagnosis
- ✅ Token refreshed on every connectionParams call
- ✅ Comprehensive logging for all lifecycle events

### File: `lib/graphql/apollo-client.ts`

Key improvements:

```typescript
// 1. Keep-alive mechanism
keepalive: 10_000, // ping every 10 seconds

// 2. Reconnection strategy
shouldRetry: (errOrCloseEvent) => {
  // Don't retry on auth errors
  if (errOrCloseEvent instanceof CloseEvent) {
    if (errOrCloseEvent.code === 4401 || errOrCloseEvent.code === 4403) {
      return false; // Don't retry
    }
  }
  return true; // Retry other errors
},
retryAttempts: Infinity,

// 3. Detailed event logging
on: {
  connecting: () => { /* ... */ },
  connected: (socket, payload) => { /* ... */ },
  closed: (event) => { /* diagnose close codes */ },
  error: (error) => { /* diagnose error types */ },
  message: (message) => { /* log different message types */ },
}
```

---

## 📡 How to Use Subscription Debug

### Basic Usage

1. **Import debug hooks:**
```typescript
import { 
  useSubscriptionDebug,
  logSubscriptionState,
  useTokenChangeMonitor,
  getWebSocketStatus
} from '@/features/dashboard/hooks/useSubscriptionDebug';
```

2. **Use in your subscription component:**
```typescript
import { useSubscription, gql } from '@apollo/client';
import { useSubscriptionDebug, logSubscriptionState } from '@/features/dashboard/hooks/useSubscriptionDebug';

const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription OnNotification {
    notificationReceived {
      id
      message
      timestamp
    }
  }
`;

export function NotificationComponent() {
  // Enable debug logging
  useSubscriptionDebug('NotificationSubscription');
  
  // Monitor token changes
  useTokenChangeMonitor('NotificationComponent', () => {
    console.log('Token changed - might need to refresh subscription');
    refetch();
  });
  
  const { data, loading, error, refetch } = useSubscription(NOTIFICATIONS_SUBSCRIPTION);
  
  // Log state changes
  useEffect(() => {
    logSubscriptionState('Notification', { data, loading, error });
  }, [data, loading, error]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.notificationReceived && (
        <div>
          <p>{data.notificationReceived.message}</p>
          <p>{new Date(data.notificationReceived.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Console Output Example

```
✅ [WS] Connected successfully
📡 [NotificationSubscription] Subscription hook mounted
⏳ [NotificationSubscription] Loading subscription data...
✅ [NotificationSubscription] Data received: { notificationReceived: { id: "123", ... } }

[NotificationSubscription] State Check
  ⏳ Loading: false
  📦 Data available: true
  ❌ Error: none
  🌐 Network Status: 7

🔌 [NotificationSubscription] WS Status: connected
```

---

## 🔍 Troubleshooting Steps

### Step 1: Check WebSocket Connection Status

**In browser console:**
```javascript
// Import from app context (or add manually)
import { getWebSocketStatus } from '@/features/dashboard/hooks/useSubscriptionDebug';

const status = getWebSocketStatus();
console.table(status);

// Expected output:
// {
//   available: true,
//   connected: true,
//   url: "ws://backend.com/graphql",
//   wsReadyState: 1,
//   readyStateLabel: "OPEN"
// }
```

### Step 2: Check Token Status

```javascript
// Is token present?
const token = localStorage.getItem('token');
console.log('Token present:', !!token);

// Is it valid JWT?
if (token?.split('.').length === 3) {
  console.log('✅ Token format: Valid JWT');
} else {
  console.log('❌ Token format: INVALID');
}

// Is token expired? (decode and check)
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token expires at:', new Date(payload.exp * 1000));
console.log('Token expired:', Date.now() > payload.exp * 1000);
```

### Step 3: Check WebSocket Events

**Open browser DevTools → Network tab:**
1. Filter by "WS" (WebSocket)
2. Find the GraphQL WebSocket connection
3. Click on it → Messages tab
4. Look for:
   - `connection_ack` → Server accepted connection
   - `next` → Subscription data incoming
   - `complete` → Subscription ended (normal)
   - `error` → Server error (abnormal)

### Step 4: Check Console Logs

**Look for patterns:**

✅ **Expected (Normal Flow):**
```
🔌 [WS] Connecting to: ws://...
✅ [WS] Connected successfully
🤝 [WS] Connection ACK received
📨 [WS] Data received: {...}
📨 [WS] Data received: {...}
```

❌ **Problem (Sudden Disconnect):**
```
✅ [WS] Connected successfully
🤝 [WS] Connection ACK received
📨 [WS] Data received: {...}
🔴 [WS] Connection closed (code: 1006, reason: abnormal closure)
🔄 [WS] Attempting to reconnect...
```

❌ **Problem (Auth Error):**
```
🔐 [WS] Auth error (code: 4401) - tidak akan retry
```

---

## 🚨 Common Error Codes & Fixes

| Code | Meaning | Fix |
|------|---------|-----|
| 1000 | Normal closure | Server intentionally closed connection |
| 1006 | Abnormal closure | Network dropped, check server |
| 4401 | Unauthorized | Invalid/expired token - re-login |
| 4403 | Forbidden | Token valid but insufficient permissions |
| 4500 | Internal server error | Check server logs |

---

## 💡 Best Practices

### 1. Always Monitor Token Changes
```typescript
useTokenChangeMonitor('ComponentName', () => {
  // Refresh subscription or re-fetch data
  refetch();
});
```

### 2. Implement Error Recovery
```typescript
const { data, error, refetch } = useSubscription(SUBSCRIPTION);

useEffect(() => {
  if (error?.message.includes('unauthorized')) {
    // Token expired - trigger re-login
    window.location.href = '/login';
  }
}, [error]);
```

### 3. Add Manual Reconnect Button
```typescript
function MyComponent() {
  const { refetch } = useSubscription(SUBSCRIPTION);
  
  const handleReconnect = () => {
    console.log('🔄 Manually reconnecting...');
    apolloClient.cache.reset();
    refetch();
  };
  
  return (
    <button onClick={handleReconnect}>
      🔄 Reconnect
    </button>
  );
}
```

### 4. Monitor Tab Visibility
```typescript
useEffect(() => {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && /* subscription stopped */) {
      console.log('🔄 Tab resumed - refreshing subscription');
      refetch();
    }
  });
}, []);
```

---

## 📊 Monitoring Checklist

Before deploying, verify:

- [ ] WebSocket connects successfully
- [ ] Data receives for at least 5 minutes without disconnect
- [ ] Keep-alive pings logged every ~10 seconds
- [ ] Token changes trigger proper reconnection
- [ ] Error cases logged with clear diagnosis
- [ ] Console logs helpful for debugging issues
- [ ] No memory leaks (check DevTools Performance)

---

## 🔗 Related Files

- `lib/graphql/apollo-client.ts` - WebSocket configuration (UPDATED)
- `features/dashboard/hooks/useSubscriptionDebug.ts` - Debug utilities (NEW)
- `TOKEN_PERSISTENCE_FIX.md` - Token persistence issues (related)

---

## 🎯 Quick Fix Checklist

### "Subscription suddenly disconnects"

```javascript
// 1. Check token
const token = localStorage.getItem('token');
console.log('Token valid:', !!token && token.split('.').length === 3);

// 2. Check WS connection
const wsStatus = getWebSocketStatus();
console.log('WS connected:', wsStatus.connected);

// 3. Check for auth errors in console
// Look for: "Auth error (code: 4401)"

// 4. If token invalid - re-login
if (!token || !isTokenValid(token)) {
  window.location.href = '/login';
}

// 5. If WS disconnected - refresh page
if (!wsStatus.connected) {
  window.location.reload();
}
```

---

## 📞 Still Not Working?

1. **Check server logs** - Backend might be rejecting subscriptions
2. **Verify WS endpoint** - Check `NEXT_PUBLIC_WS_ENDPOINT` is correct
3. **Check firewall** - WebSocket might be blocked on network
4. **Try different network** - Some networks block WebSocket
5. **Check browser console** for any JS errors
6. **Look for**: Any "token" or "auth" related errors
