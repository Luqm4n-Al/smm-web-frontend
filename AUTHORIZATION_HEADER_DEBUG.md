# Authorization Header Debugging Guide

## 🔐 New Authorization Header Tracking

Enhanced debugging sekarang include full tracking Authorization header yang dikirim ke server.

---

## 📊 Enhanced Console Output

### **1. Initialization Phase - Authorization Check**

```
🚀 [AnalyticsSubscription] Initialization Checklist
  ✅ Hook instantiated
  ✅ GraphQL subscription defined
  Token Status    ✅ Present (eyJhbGciOiJIUzI1NiIs...)
  WS Endpoint     ✅ ws://192.168.100.114:8080/graphql
  Timestamp       8:16:30 PM

🔐 [AnalyticsSubscription] Authorization Header Status
  Header Value         Bearer eyJhbGciOiJIUzI1NiIs...
  Token Present        ✅ Yes
  Token Valid          ✅ Yes
  Token Preview        eyJhbGciOiJIUzI1NiIs...2VudC5VU0VS

📋 Token payload:
  Subject              user@example.com
  Issued At            4/27/2026, 8:00:00 PM
  Expires At           4/28/2026, 8:00:00 PM
  Status               ✅ Valid
  Time Left            23 hours 45 minutes
```

---

### **2. Comprehensive Auth Check**

```
🔐 [AnalyticsSubscription] Comprehensive Auth Check
  1️⃣ Token in localStorage             ✅ Found
  2️⃣ Token format                      ✅ Valid JWT
  3️⃣ Token expiration                  ✅ Valid
  4️⃣ WS endpoint                       ✅ ws://192.168.100.114:8080/graphql
  5️⃣ Auth header will be sent          ✅ Will be sent
  6️⃣ GraphQL endpoint                  ✅ http://192.168.100.114:8080/query

✅ [AnalyticsSubscription] All auth checks PASSED - Ready to subscribe
```

---

### **3. WS Connection Status - With Authorization Header**

```
🔌 [AnalyticsSubscription] Initial WS Connection Check
  🔌 WS status: {
    connected: null,
    url: "ws://192.168.100.114:8080/graphql",
    readyState: null
  }
  
  🔐 Authorization Header:
    Header Value         Bearer eyJhbGciOiJIUzI1NiIs...
    Token Present        ✅ Yes
    Token Valid          ✅ Yes
```

---

### **4. Periodic WS Status Check (Every 30s)**

```
🔌 [AnalyticsSubscription] WS Connection Status Changed
  ⏰ Timestamp: 8:17:00 PM
  🔗 URL: ws://192.168.100.114:8080/graphql
  📊 Connected: true
  🎯 Ready State: OPEN
  
  🔐 Authorization Header:
    Header Value         Bearer eyJhbGciOiJIUzI1NiIs...
    Token Present        ✅ Yes
    Token Valid          ✅ Yes
    Token Preview        eyJhbGciOiJIUzI1NiIs...2VudC5VU0VS
  
  ✅ WebSocket connected and ready for data
```

---

### **5. Error Case - Missing Authorization**

```
🚀 [AnalyticsSubscription] Initialization Checklist
  ✅ Hook instantiated
  ❌ Token Status: Missing
  ✅ WS Endpoint: ✅ ws://192.168.100.114:8080/graphql

🔐 [AnalyticsSubscription] Authorization Header Status
  ❌ No token in localStorage
  💡 Steps to fix:
    1. Check if you logged in
    2. Check TokenManager is mounted
    3. Run: localStorage.getItem("token")

🔐 [AnalyticsSubscription] Comprehensive Auth Check
  1️⃣ Token in localStorage             ❌ Missing
  2️⃣ Token format                      ❌ Invalid JWT
  3️⃣ Token expiration                  ❌ Cannot check
  4️⃣ WS endpoint                       ✅ Configured
  5️⃣ Auth header will be sent          ❌ Not available
  6️⃣ GraphQL endpoint                  ✅ Configured

❌ [AnalyticsSubscription] Some auth checks FAILED - Check above
```

---

### **6. Error Case - Token Expired**

```
🔐 [AnalyticsSubscription] Authorization Header Status
  ✅ Token present in localStorage
  📊 Format: ✅ Valid JWT (parts: 3)
  📋 Token preview: eyJhbGciOiJIUzI1NiIs...VN...
  📦 Token size: 234 bytes
  
  📋 Token payload:
    Subject              user@example.com
    Issued At            4/26/2026, 8:00:00 PM
    Expires At           4/27/2026, 8:00:00 PM
    Status               ⏰ EXPIRED
    Time Left            N/A
  
  🔐 Token EXPIRED - need to re-login

📤 Authorization header to be sent:
   Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🔐 New Functions Available

### **1. logAuthorizationHeader(componentName)**
Logs detailed Authorization header and token info.

```typescript
import { logAuthorizationHeader } from '@/features/dashboard/hooks/useSubscriptionDebug';

// In component or hook:
useEffect(() => {
  logAuthorizationHeader('AnalyticsSubscription');
}, []);

// Output:
// 🔐 [AnalyticsSubscription] Authorization Header Status
// ✅ Token present in localStorage
// ...
```

---

### **2. performAuthCheck(componentName)**
Comprehensive auth check - validates everything needed.

```typescript
import { performAuthCheck } from '@/features/dashboard/hooks/useSubscriptionDebug';

// In component or hook:
useEffect(() => {
  performAuthCheck('AnalyticsSubscription');
}, []);

// Output:
// 🔐 [AnalyticsSubscription] Comprehensive Auth Check
// 1️⃣ Token in localStorage ✅ Found
// 2️⃣ Token format ✅ Valid JWT
// ... (6 checks total)
// ✅ All auth checks PASSED
```

---

### **3. getWebSocketStatus()**
Enhanced to include Authorization header details.

```typescript
import { getWebSocketStatus } from '@/features/dashboard/hooks/useSubscriptionDebug';

const wsStatus = getWebSocketStatus();
console.log('Auth Header:', wsStatus.authHeader);
console.log('Token Present:', wsStatus.tokenStatus?.present);
console.log('Token Valid:', wsStatus.tokenStatus?.valid);

// Returns object with:
// {
//   available: boolean,
//   connected: boolean | null,
//   url: string,
//   authHeader: string,           // NEW!
//   tokenStatus: {                // NEW!
//     present: boolean,
//     valid: boolean,
//     preview: string
//   }
// }
```

---

## 📋 Troubleshooting Checklist

### ✅ **If Authorization Header Shows ❌ No token**

1. **Check TokenManager mounted:**
   ```javascript
   // In browser console:
   document.querySelector('[data-testid="token-manager"]')
   // Or check if TokenManager component rendered
   ```

2. **Check localStorage:**
   ```javascript
   console.log('Token in localStorage:', localStorage.getItem('token'))
   ```

3. **Check session:**
   ```javascript
   // Open DevTools → Application → Cookies
   // Look for nextauth.session-token or similar
   ```

4. **Fix:** Re-login or refresh page

---

### ✅ **If Authorization Header Shows ⏰ EXPIRED**

1. **Token expired:**
   ```javascript
   const token = localStorage.getItem('token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   new Date(payload.exp * 1000)  // Check expiration date
   ```

2. **Fix:** Re-login to get fresh token
   ```javascript
   window.location.href = '/login'
   ```

3. **Or refresh token:**
   ```javascript
   // If you have token refresh mechanism
   // Call it here
   ```

---

### ✅ **If WS Connection but No Authorization Header**

1. **Check authLink in apollo-client.ts:**
   ```typescript
   const authLink = setContext((_, { headers }) => {
     const token = localStorage.getItem('token');
     return {
       headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : '',
       },
     };
   });
   ```

2. **Verify:**
   ```javascript
   // In console:
   const token = localStorage.getItem('token');
   console.log('Authorization:', `Bearer ${token}`)
   ```

3. **Check Network tab:**
   - Open DevTools → Network
   - Filter by "WS"
   - Find GraphQL WebSocket
   - Check "Headers" tab
   - Look for "Authorization" header

---

## 🔍 Complete Auth Flow Debugging

### **Step 1: Check Token Status**
```javascript
performAuthCheck('MyComponent')
// Logs: All 6 auth checks
```

### **Step 2: Check Authorization Header**
```javascript
logAuthorizationHeader('MyComponent')
// Logs: Detailed token and header info
```

### **Step 3: Check WS Connection**
```javascript
const wsStatus = getWebSocketStatus()
console.table({
  'URL': wsStatus.url,
  'Connected': wsStatus.connected,
  'Auth Header': wsStatus.authHeader,
  'Token Present': wsStatus.tokenStatus?.present,
  'Token Valid': wsStatus.tokenStatus?.valid,
})
```

### **Step 4: Check Network Tab**
- Open DevTools → Network tab
- Filter: "graphql" or "query"
- Check HTTP Request → Headers
- Verify "Authorization: Bearer ..." present

---

## 📈 Expected Authorization Flow

**Successful Flow:**
```
T0s   🔐 Check Authorization Header
      ✅ Token present
      ✅ Token valid
      ✅ Not expired

T+1s  📤 Authorization header to be sent:
      Bearer eyJhbGciOiJIUzI1NiIs...

T+2s  🔌 WebSocket connects
      (Using Authorization header in connection params)

T+3s  🤝 Connection ACK
      (Server accepted Authorization header)

T+4s  📨 Data starts flowing
```

---

## 🚨 Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| No token | `❌ No token in localStorage` | Re-login |
| Token expired | `⏰ EXPIRED` | Re-login or refresh token |
| Invalid JWT | `❌ Invalid JWT` | Check token format, clear and re-login |
| WS but no auth | Connected but unauthorized errors | Check authLink config |
| Auth header missing | No "Authorization" in Network headers | Check apollo-client.ts |
| Server rejects auth | `4401` error | Check token secret on server |

---

## 📝 Sample Console Output - Complete

```
🚀 [AnalyticsSubscription] Initialization Checklist
  ✅ Hook instantiated
  ✅ GraphQL subscription defined: subscription AnalyticsUpdated
  Token Status     ✅ Present (eyJhbGciOiJIUzI1NiIs...)
  WS Endpoint      ✅ ws://192.168.100.114:8080/graphql
  Timestamp        8:16:30 PM

🔐 [AnalyticsSubscription] Authorization Header Status
  ✅ Token present in localStorage
  📊 Format: ✅ Valid JWT (parts: 3)
  📋 Token preview: eyJhbGciOiJIUzI1NiIs...VN7Rm...
  📦 Token size: 234 bytes
  
  📋 Token payload:
    Subject          user@example.com
    Issued At        4/27/2026, 8:00:00 PM
    Expires At       4/28/2026, 8:00:00 PM
    Status           ✅ Valid
    Time Left        23 hours 45 minutes
  
  📤 Authorization header to be sent:
     Bearer eyJhbGciOiJIUzI1NiIs...

🔐 [AnalyticsSubscription] Comprehensive Auth Check
  1️⃣ Token in localStorage    ✅ Found
  2️⃣ Token format             ✅ Valid JWT
  3️⃣ Token expiration         ✅ Valid
  4️⃣ WS endpoint              ✅ ws://192.168.100.114:8080/graphql
  5️⃣ Auth header will be sent ✅ Will be sent
  6️⃣ GraphQL endpoint         ✅ http://192.168.100.114:8080/query

✅ [AnalyticsSubscription] All auth checks PASSED - Ready to subscribe

🔌 [AnalyticsSubscription] Initial WS Connection Check
  🔌 WS status: {
    connected: null,
    url: "ws://192.168.100.114:8080/graphql",
    readyState: null
  }
  
  🔐 Authorization Header:
    Header Value         Bearer eyJhbGciOiJIUzI1NiIs...
    Token Present        ✅ Yes
    Token Valid          ✅ Yes

📡 [AnalyticsSubscription] Hook mounted - subscribing to analytics updates

🔌 Connecting to: ws://192.168.100.114:8080/graphql

📡 [AnalyticsSubscription] State Update - 8:16:31 PM
  Loading         true
  Data Available  false
  Error           false

✅ Connected successfully

🤝 Connection ACK received

✅ [AnalyticsSubscription] Received live data update

📦 [AnalyticsSubscription] Received Data Details
  🕐 Received at: 8:16:32 PM
  📋 Data fields: heatmap, ageRange, genderAudience, socialMedia, growthMatrix
  📊 Data size: 2847 bytes
  ✔️ All important fields present
  📊 Data sample: {...}

📊 [AnalyticsSubscription] State Update - 8:16:32 PM
  Loading         false
  Data Available  true
  Error           false
```

---

## 🎯 Quick Debug Commands

```javascript
// Check everything at once
performAuthCheck('AnalyticsSubscription')

// Check just authorization header
logAuthorizationHeader('AnalyticsSubscription')

// Check WS status with auth
const ws = getWebSocketStatus()
console.table(ws)

// Check token manually
const token = localStorage.getItem('token')
console.log('Token:', token)
console.log('Is JWT:', token?.split('.').length === 3)

// Check if token expired
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))
console.log('Is expired:', Date.now() > payload.exp * 1000)
```

---

**All Authorization header now fully tracked and logged! 🔐✅**
