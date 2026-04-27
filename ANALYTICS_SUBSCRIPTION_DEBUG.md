# Analytics Subscription Debugging Implementation Guide

## 📋 Overview

Updated `features/dashboard/graphql/analytics.subscription.ts` dengan comprehensive debugging tanpa mengubah UI. Debugging akan output ke browser console dengan detailed logs untuk setiap kondisi.

---

## 🔧 What's Implemented

### 1. **GraphQL Subscription Query**
- Field-level comments explaining setiap field
- Dokumentasi yang jelas tentang data structure
- Inline comments untuk readability

### 2. **useAnalyticsSubscription Hook**
Enhanced dengan 7 layers of debugging:

#### Layer 1: Subscription Lifecycle
```javascript
useSubscriptionDebug('AnalyticsSubscription')
// Logs: connecting, connected, reconnecting, disconnected
```

#### Layer 2: Token Change Monitoring
```javascript
useTokenChangeMonitor('AnalyticsSubscription')
// Logs saat token berubah
// Triggers re-subscription dengan token baru
```

#### Layer 3: State Change Logging
```javascript
logSubscriptionState('AnalyticsSubscription')
// Logs setiap kali: data, loading, atau error berubah
```

#### Layer 4: Data Reception & Validation
- Logs ketika data diterima
- Validates important fields present
- Shows data sample untuk inspection
- Warns jika ada missing fields

#### Layer 5: Error Diagnosis
- Detects auth errors → suggest re-login
- Detects network errors → suggest check connectivity
- Detects timeout → suggest check server

#### Layer 6: WebSocket Connection Status
- Periodic check setiap 30 detik
- Warns jika WS disconnected tapi data tidak ada

#### Layer 7: Lifecycle Tracking
- Log saat hook mounted
- Log saat hook unmounted

---

## 📊 Console Output Examples

### **Successful Subscription Flow**
```
📡 [AnalyticsSubscription] Hook mounted - subscribing to analytics updates
🔌 [WS] Connecting to: ws://backend.com/graphql
✅ [WS] Connected successfully
🤝 [WS] Connection ACK received
⏳ [AnalyticsSubscription] Waiting for data...
✅ [AnalyticsSubscription] Received live data update
📦 [AnalyticsSubscription] Data fields: heatmap, ageRange, genderAudience, socialMedia, growthMatrix
✔️ [AnalyticsSubscription] All important fields present
📊 [AnalyticsSubscription] Data sample: {
  heatmapSample: { level: 3, code: "ID", value: 150 },
  ageRangeSample: { age: "18-24", quantity: 500 },
  genderSample: { gender: "M", quantity: 300 },
  instagramSentiment: { positive: 450, neutral: 50, negative: 10 }
}
```

### **Token Change Detection**
```
🔄 [AnalyticsSubscription] Token changed - subscription will refresh on next render
📡 [AnalyticsSubscription] Hook unmounted - unsubscribing
📡 [AnalyticsSubscription] Hook mounted - subscribing to analytics updates
✅ [AnalyticsSubscription] Received live data update
```

### **Auth Error Handling**
```
❌ [WS] Authentication failed - check token
🔐 [AnalyticsSubscription] Auth error - token might be expired
💡 Suggestion: Try refreshing page or re-login
```

### **Network Error Handling**
```
❌ [WS] Network error
🌐 [AnalyticsSubscription] Network error - check connectivity
```

### **WebSocket Disconnection Warning**
```
⚠️ [AnalyticsSubscription] WebSocket disconnected - might not receive updates
🔌 WebSocket status: { connected: false, url: "ws://...", ... }
```

---

## 🎯 How to Use in Components

### Basic Usage
```typescript
import { useAnalyticsSubscription } from '@/features/dashboard/graphql/analytics.subscription';

export function AnalyticsDashboard() {
  // Hook automatically logs everything to console
  const { liveData, isLiveLoading, liveError, connectionStatus } = useAnalyticsSubscription();

  if (isLiveLoading) return <div>Loading analytics...</div>;
  if (liveError) return <div>Error: {liveError.message}</div>;

  return (
    <div>
      {/* UI remains exactly the same - no changes needed */}
      <SentimentSection data={liveData?.socialMedia} />
      <AgePieChart data={liveData?.ageRange} />
      <GenderChart data={liveData?.genderAudience} />
      <GeoMap data={liveData?.heatmap} />
    </div>
  );
}
```

### Advanced Usage - Manual Diagnostics
```typescript
export function AdvancedDashboard() {
  const { liveData, isLiveLoading, liveError, connectionStatus } = useAnalyticsSubscription();

  // Browser console akan auto-log semua debug info
  // Manual check jika perlu:
  
  useEffect(() => {
    if (!connectionStatus.connected) {
      console.warn('⚠️ Not connected to WebSocket');
    }
  }, [connectionStatus]);

  return (
    <div>
      {/* UI tetap sama */}
      <Analytics data={liveData} />
    </div>
  );
}
```

---

## 🔍 Debugging Commands in Browser Console

### Check subscription status
```javascript
// Dari console, lihat di tab Network → Filter "WS"
// Atau manual check:
getWebSocketStatus()
```

### Check current token
```javascript
localStorage.getItem('token')
```

### Check if token is valid JWT
```javascript
const token = localStorage.getItem('token');
token?.split('.').length === 3 ? '✅ Valid JWT' : '❌ Invalid'
```

### Check token expiration
```javascript
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
new Date(payload.exp * 1000)
```

---

## 📝 Comments in Code

Setiap section di hook punya detailed comments:

```typescript
// ============================================
// 1. Subscribe ke GraphQL subscription
// ============================================
// Penjelasan apa yang dilakukan

// ============================================
// 2. Enable debug logging untuk subscription ini
// ============================================
// Penjelasan lengkap tentang logging

// ... dst
```

---

## 🎨 No UI Changes

✅ **Tetap sama:**
- Component visual appearance
- Data flow
- State management
- Rendering logic

❌ **Tidak berubah:**
- UI layout
- Colors
- Components
- Props

✅ **Yang ditambah:**
- Console logging (background)
- Error diagnosis
- Connection monitoring
- Data validation

---

## 🚨 Troubleshooting with New Debugging

### Problem 1: "Subscription connects then disconnects"

**Check console untuk:**
```
❌ [AnalyticsSubscription] Error: unauthorized
🔐 Auth error - token might be expired
```

**Solution:** Re-login atau refresh token

---

### Problem 2: "No data received"

**Check console untuk:**
```
⏳ [AnalyticsSubscription] Waiting for data...
// ... nothing after this for 10+ seconds
```

**Check:** 
- WebSocket connection (Network tab)
- Server logs
- Run: `getWebSocketStatus()`

---

### Problem 3: "Sudden data stop"

**Check console untuk:**
```
✅ [AnalyticsSubscription] Received live data update
// ... data comes for a while
🔴 [WS] Connection closed (code: 1006)
```

**Causes:**
- WebSocket dead connection
- Token expired
- Server error

---

## 📚 File Structure

```
features/dashboard/graphql/
├── analytics.subscription.ts ← UPDATED dengan debugging
├── analytics.query.ts
├── analytics.types.ts
└── ...

features/dashboard/hooks/
└── useSubscriptionDebug.ts ← NEW (imported in subscription)
```

---

## ✅ Verification Checklist

- [x] Subscription hook properly decorated with debug logs
- [x] No UI changes - components remain visual unchanged
- [x] Comprehensive comments throughout code
- [x] 7 layers of debugging implemented
- [x] Error diagnosis built-in
- [x] Connection status tracking
- [x] Token change monitoring
- [x] All TypeScript errors fixed

---

## 🚀 Next Steps

1. **Test the subscription** - Open dashboard and watch console
2. **Trigger different scenarios:**
   - Successful data receive
   - Token expiration (logout from another tab)
   - Network disconnect
   - Server error
3. **Monitor console logs** - Each scenario should show clear diagnosis
4. **Use debugging info** to fix any issues

---

## 📞 Debug Output Reference

| Log | Meaning | Action |
|-----|---------|--------|
| 📡 Hook mounted | Subscription starting | Normal |
| ⏳ Waiting for data | Connected but no data yet | Wait 5s |
| ✅ Received live data | Data arrived | Normal |
| 📦 Data fields | Validation check | Check completeness |
| ✔️ All fields present | Data valid | Normal |
| 🔴 Connection closed | WebSocket disconnected | Check network |
| ❌ Error | Something failed | Check message |
| 🔐 Auth error | Token issue | Re-login |
| 🌐 Network error | Network issue | Check connectivity |
