# Enhanced WebSocket Debugging Guide

## 📡 Improved Logging Structure

Debugging output sudah enhanced dengan lebih detail logs untuk track WS connection lifecycle.

---

## 📊 Console Output Examples

### **1. Initial Startup (First Load)**

```
🚀 [AnalyticsSubscription] Initialization Checklist
  ✅ Hook instantiated
  ✅ GraphQL subscription defined: subscription AnalyticsUpdated...
  Token Status   ✅ Present (eyJhbGciOiJIUzI1NiIs...)
  WS Endpoint    ✅ ws://192.168.100.114:8080/graphql
  Timestamp      14:30:45

🔌 [AnalyticsSubscription] Initial WS status: {
  connected: null,
  url: "ws://192.168.100.114:8080/graphql",
  readyState: null
}

📡 [AnalyticsSubscription] Initialization
  ⏰ Timestamp: 14:30:45
  🔗 Endpoint: ws://192.168.100.114:8080/graphql
  🔐 Token present: true
  🎯 Subscription: subscription AnalyticsUpdated {

📡 [AnalyticsSubscription] Hook mounted - subscribing to analytics updates
```

---

### **2. Connecting Phase**

```
🔌 [WS] Connecting to: ws://192.168.100.114:8080/graphql

📊 [AnalyticsSubscription] State Update - 14:30:46
  Loading           ✅ true
  Data Available    ❌ false
  Error             ❌ false
  Error Message     "none"

📡 [AnalyticsSubscription] State Check
  ⏳ Loading: true
  📦 Data available: false
  ❌ Error: none
  🌐 Network Status: undefined
```

---

### **3. Connected Phase**

```
✅ [WS] Connected successfully
🤝 [WS] Connection ACK received

📊 [AnalyticsSubscription] State Update - 14:30:47
  Loading           ✅ true
  Data Available    ❌ false
  Error             ❌ false
  Error Message     "none"

⏳ [AnalyticsSubscription] Waiting for data...
```

---

### **4. Data Received Successfully**

```
📨 [WS] Data received: { notificationReceived: {...} }

✅ [AnalyticsSubscription] Received live data update

📦 [AnalyticsSubscription] Received Data Details
  🕐 Received at: 14:30:48
  📋 Data fields: heatmap, ageRange, genderAudience, socialMedia, growthMatrix
  📊 Data size: 2847 bytes
  ✔️ All important fields present
  📊 Data sample: {
    heatmapCount: 34,
    heatmapSample: { level: 3, code: "ID", value: 2500 },
    ageRangeCount: 5,
    ageRangeSample: { age: "18-24", quantity: 1200 },
    genderCount: 2,
    genderSample: { gender: "M", quantity: 3500 },
    instagramFollowers: 45000,
    tiktokFollowers: 32000,
    instagramSentiment: { positive: 4200, neutral: 800, negative: 150 },
    tiktokSentiment: { positive: 3100, neutral: 600, negative: 200 }
  }

📊 [AnalyticsSubscription] State Update - 14:30:48
  Loading           ❌ false
  Data Available    ✅ true
  Error             ❌ false
  Error Message     "none"
```

---

### **5. WS Status Polling (Every 30 Seconds)**

```
🔌 [AnalyticsSubscription] WS Connection Status Changed
  ⏰ Timestamp: 14:31:18
  🔗 URL: ws://192.168.100.114:8080/graphql
  📊 Connected: true
  🎯 Ready State: OPEN
  ✅ WebSocket connected and ready for data
```

---

### **6. Error: Token Expired**

```
🔐 [WS] Auth error (code: 4401) - tidak akan retry
🔐 [AnalyticsSubscription] Auth error - token might be expired
💡 Suggestion: Try refreshing page or re-login

📊 [AnalyticsSubscription] State Update - 14:31:22
  Loading           ❌ false
  Data Available    ❌ false
  Error             ✅ true
  Error Message     "Unauthorized"
```

---

### **7. Error: Network Issue**

```
🌐 [WS] Network error

❌ [AnalyticsSubscription] Error: Network connection failed
🌐 [AnalyticsSubscription] Network error - check connectivity

📊 [AnalyticsSubscription] State Update - 14:31:25
  Loading           ❌ false
  Data Available    ❌ false
  Error             ✅ true
  Error Message     "network error"

⚠️ [AnalyticsSubscription] Potential issue: WS disconnected, not loading, but no data/error
```

---

### **8. Error: Server Timeout**

```
⏱️ [WS] Timeout - check server availability

❌ [AnalyticsSubscription] Error: Timeout
⏱️ [AnalyticsSubscription] Timeout - server not responding

📊 [AnalyticsSubscription] State Update - 14:31:30
  Loading           ❌ false
  Data Available    ❌ false
  Error             ✅ true
  Error Message     "timeout"
```

---

### **9. Connection Status Change Detection**

```
🔌 [AnalyticsSubscription] WS Connection Status Changed
  ⏰ Timestamp: 14:32:00
  🔗 URL: ws://192.168.100.114:8080/graphql
  📊 Connected: false
  🎯 Ready State: CLOSED
  ⚠️ WebSocket disconnected - might not receive updates
  💡 Check: Network connection, Server status, Token validity

🔄 [WS] Attempting to reconnect...

🔌 [AnalyticsSubscription] WS Connection Status Changed
  ⏰ Timestamp: 14:32:05
  🔗 URL: ws://192.168.100.114:8080/graphql
  📊 Connected: true
  🎯 Ready State: OPEN
  ✅ WebSocket connected and ready for data
```

---

### **10. Token Change Detected**

```
🔄 [AnalyticsSubscription] Token changed - subscription will refresh on next render

📡 [AnalyticsSubscription] Hook unmounted - unsubscribing
📡 [AnalyticsSubscription] Hook mounted - subscribing to analytics updates

🚀 [AnalyticsSubscription] Initialization Checklist
  ✅ Hook instantiated
  ✅ GraphQL subscription defined
  Token Status   ✅ Present (newTokenValue...)
  ...
```

---

## 🔍 Understanding the Phases

### **Phase 1: Initialization ⚙️**
```
🚀 Initialization Checklist
└─ Checks: Token, Endpoint, Config
```

### **Phase 2: Connection Attempt 🔌**
```
🔌 Initial WS status
└─ Connecting to server
```

### **Phase 3: Connected State ✅**
```
✅ WS Connected
└─ Server accepting connections
```

### **Phase 4: Awaiting Data ⏳**
```
📊 State Update
└─ Loading: true
└─ Waiting for subscription data
```

### **Phase 5: Data Reception 📨**
```
✅ Received live data update
├─ Data fields validation
├─ Data sample preview
└─ Field counts
```

### **Phase 6: Periodic Monitoring 🔄**
```
🔌 WS Connection Status Changed
└─ Every 30 seconds
└─ Detects disconnections
```

---

## 📋 Debugging Checklist

Ketika ada masalah, check logs dalam urutan ini:

### ✅ **Initialization Phase**
```
🚀 Initialization Checklist
  ✅ Token present
  ✅ WS Endpoint configured
  ✅ GraphQL subscription defined
```

### ✅ **Connection Phase**
```
🔌 Initial WS status: connected
🔗 URL: ws://...
📊 Connected: true or null (pending)
```

### ✅ **Loading Phase**
```
📊 State Update
  Loading: true (expected saat waiting for data)
```

### ✅ **Data Reception Phase**
```
✅ Received live data update
✔️ All important fields present
📊 Data sample menunjukkan values
```

### ✅ **Monitoring Phase**
```
🔌 WS Connection Status Changed (every 30s)
✅ WebSocket connected and ready
```

---

## 🚨 Troubleshooting with New Logs

### **Problem: "No data received after 30 seconds"**

**Check logs:**
```
⏳ [AnalyticsSubscription] Waiting for data...
// Nothing after this
```

**Solutions:**
1. Check `🚀 Initialization Checklist` - Token ada?
2. Check `🔌 Initial WS status` - connected?
3. Check `📊 State Update` - ada error?
4. Open Network tab → Filter "WS" → See messages

---

### **Problem: "WebSocket keeps disconnecting"**

**Check logs:**
```
🔌 WS Connection Status Changed
  Connected: true
  // ... 30 seconds
🔌 WS Connection Status Changed
  Connected: false
  ⚠️ WebSocket disconnected
```

**Solutions:**
1. Check token validity: `localStorage.getItem('token')`
2. Check server status: `getWebSocketStatus()`
3. Look for error code in logs: `4401` (auth), `1006` (network)

---

### **Problem: "Auth error 4401"**

**Check logs:**
```
🔐 [AnalyticsSubscription] Auth error - token might be expired
💡 Suggestion: Try refreshing page or re-login
```

**Solutions:**
1. Logout dan login ulang
2. Check token expiration: `new Date(payload.exp * 1000)`
3. Force refresh: `window.location.reload()`

---

### **Problem: "Network error"**

**Check logs:**
```
🌐 [AnalyticsSubscription] Network error - check connectivity
```

**Solutions:**
1. Check internet connection
2. Check firewall/proxy blocking WebSocket
3. Check server is running: `ping backend.com`
4. Try: `curl -i http://backend.com/graphql`

---

## 💡 Console Filtering Tips

### Filter by component:
```javascript
// Show only AnalyticsSubscription logs
console.filter = "[AnalyticsSubscription]"
```

### Search by emoji:
- 📡 = Lifecycle events
- 🔌 = WebSocket connection
- 📊 = State changes
- ✅ = Success
- ❌ = Errors
- ⚠️ = Warnings

### View as table:
```javascript
// DevTools → Console settings → Enable "Group similar messages"
```

---

## 📈 Expected Timeline

**Normal successful subscription:**
```
T0    🚀 Initialization Checklist
T+1s  🔌 Initial WS status
T+1s  📡 Hook mounted
T+2s  🔌 WS Connection Status Changed (connected)
T+3s  ⏳ Waiting for data
T+5s  ✅ Received live data update
T+35s 🔌 WS Connection Status Changed (periodic check)
T+65s 🔌 WS Connection Status Changed (periodic check)
...
```

**Total time to first data: ~5 seconds**

---

## 🎯 What Each Log Group Means

| Group | Meaning | Action |
|-------|---------|--------|
| 🚀 Initialization | Setup phase | Check config |
| 🔌 WS Status | Connection state | Check network |
| 📊 State Update | Loading/data/error | Wait or check error |
| ⏳ Waiting | Pending server response | Be patient |
| ✅ Received Data | Data arrived | Normal - display it |
| ❌ Error | Something failed | See error message |
| 🔄 Token Changed | Auth updated | Resubscribe auto |

---

## 📝 Sample Complete Flow

```
🚀 Initialization Checklist
  ✅ Hook instantiated
  ✅ GraphQL subscription defined
  Token Status ✅ Present
  WS Endpoint ✅ ws://backend:8080/graphql

🔌 Initial WS status: {connected: null}

📡 Hook mounted - subscribing to analytics updates

🔌 Connecting to: ws://backend:8080/graphql

📊 State Update - 14:30:46
  Loading ✅ true

⏳ Waiting for data...

✅ Connected successfully

🤝 Connection ACK received

📊 State Update - 14:30:47
  Loading ✅ true

📨 Data received

✅ Received live data update

📦 Received Data Details
  🕐 Received at: 14:30:48
  📋 Data fields: heatmap, ageRange, genderAudience...
  ✔️ All important fields present
  📊 Data sample: {...}

📊 State Update - 14:30:48
  Loading ❌ false
  Data Available ✅ true
  Error ❌ false

[Periodic check every 30s]

🔌 WS Connection Status Changed
  Connected ✅ true
  Ready State: OPEN
```

---

## 🔧 Disabling Debug Logs (if needed)

To turn off debug logs in production:

```typescript
// In useAnalyticsSubscription hook
useSubscriptionDebug('AnalyticsSubscription', { enabled: process.env.NODE_ENV === 'development' });
```

Or globally in apollo-client.ts:
```typescript
const isProduction = process.env.NODE_ENV === 'production';

on: {
  connecting: () => {
    if (!isProduction) console.log('🔌 [WS] Connecting...');
  },
  // ... etc
}
```
