# Token Persistence Fix - After Page Refresh

## 🐛 Problem

Setelah login, data analytics tampil. Tapi setelah page refresh → unauthorized.

**Debug Status menunjukkan:**
```
NextAuth Status: authenticated ✅
Session Access Token: eyJhbGciOiJIUzI1NiIs...
localStorage Token: NOT FOUND ❌
Auth Header Sent: EMPTY ❌
```

**Root Cause:** Token ada di session, tapi tidak tersimpan ke localStorage.

---

## 🔧 Root Cause Analysis

### Flow yang Seharusnya:
```
1. User Login
   ↓
2. NextAuth set session + token
   ↓
3. TokenManager.tsx detect session change
   ↓ (useEffect trigger)
4. TokenManager save token ke localStorage
   ↓
5. Apollo Client read dari localStorage
   ↓
6. GraphQL request berjalan dengan auth header
```

### Yang Terjadi:
```
1. User Login → session OK ✅
2. TokenManager NOT save token ❌
3. Refresh page → session hilang (temporary)
4. localStorage kosong → no token
5. Apollo Client kirim request WITHOUT auth header
6. Backend return unauthorized
```

### Penyebab:
1. TokenManager useEffect dependency `[session]` tidak optimal
   - Object comparison di JS tricky
   - Bisa jadi dependency tidak trigger saat seharusnya

2. Apollo authLink selalu baca dari localStorage
   - Jika localStorage kosong saat startup → no token
   - Bahkan setelah TokenManager save token, Apollo cache lama

3. No fallback untuk ensure token ter-save

---

## ✅ Solusi Implementasi

### 1. **TokenManager.tsx** - Improved
```typescript
// ✅ Better useEffect trigger
useEffect(() => {
  if (status === 'authenticated') {
    saveTokenToLocalStorage();
  } else if (status === 'unauthenticated') {
    localStorage.removeItem('token');
  }
}, [status, session?.user?.accessToken, saveTokenToLocalStorage]);

// ✅ Specific dependency - NOT full session object
// ✅ Also track status untuk unauthenticated case
// ✅ useCallback untuk stable reference
```

**Changes:**
- Dependency dari `[session]` → `[status, session?.user?.accessToken, saveTokenToLocalStorage]`
- Add status tracking untuk handle logout
- useCallback wrapper untuk stable function reference
- Add detailed console logging untuk debug
- Add try-catch untuk error handling

### 2. **Apollo Client** - Enhanced authLink
```typescript
const authLink = setContext((_, { headers }) => {
  // Read token SETIAP REQUEST (bukan cached)
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});
```

**Changes:**
- Always read token fresh dari localStorage setiap request
- Jangan hardcode Bearer string, gunakan conditional
- Add console logging untuk track token presence

### 3. **DebugTokenStatus.tsx** - Better Polling
```typescript
// Poll setiap 500ms untuk detect TokenManager sync
const interval = setInterval(checkToken, 500);

// Show detailed sync status
syncStatus === 'synced' → Token match
syncStatus === 'syncing' → Still waiting for TokenManager
syncStatus === 'failed' → Token mismatch
```

**Changes:**
- Polling untuk detect localStorage change in real-time
- Show sync status - not just presence
- Better diagnosis messages
- Show console logging hint

---

## 🎯 How to Fix Now

### 1. **Wait for TokenManager Sync**
- Buka `/dashboard/analytics`
- Lihat debug box di kanan bawah
- Tunggu sampai status berubah:
  ```
  ⏳ SYNCING...
       ↓ (2-3 detik)
  ✅ SYNCED
  ```

### 2. **If Still Failed After 5 Seconds**
- Check console (F12 → Console tab)
- Look for logs:
  ```
  ✅ [TokenManager] Saving token to localStorage
  ✅ [TokenManager] Token verified: OK
  🔐 [Apollo authLink] Token found in localStorage
  ```

- If you see errors:
  ```
  ❌ [TokenManager] Error saving token: ...
  ```
  → ada issue di TokenManager

### 3. **If Debug Shows "Sync Failed"**
- Tokens tidak match
- Possible: Session corrupted atau localStorage inconsistent
- **Fix**: Refresh page atau clear localStorage & login again:
  ```javascript
  // Di browser console:
  localStorage.clear();
  window.location.href = '/login';
  ```

### 4. **After Refresh Page**
- Debug should show:
  ```
  NextAuth Status: authenticated ✅
  Session Token: eyJ... ✅
  localStorage Token: eyJ... ✅
  ✅ SYNCED
  ```

- If not → tunggu 2-3 detik untuk TokenManager sync

---

## 📋 What Gets Fixed

| Issue | Before | After |
|-------|--------|-------|
| Token not saved after login | ❌ Fail | ✅ Saved via improved useEffect |
| Token not persist after refresh | ❌ Lost | ✅ Saved to localStorage |
| useEffect not trigger | ❌ Sometimes miss | ✅ Specific dependency + useCallback |
| Apollo send request without token | ❌ Unauthorized | ✅ Always read fresh from localStorage |
| Hard to debug sync issue | ❌ No info | ✅ Detailed polling + sync status |

---

## 📁 Files Modified

1. **lib/auth/TokenManager.tsx**
   - Better useEffect dependencies
   - useCallback wrapper
   - Detailed logging
   - Error handling

2. **lib/graphql/client.ts**
   - Always read fresh from localStorage
   - Conditional authorization header
   - Debug logging

3. **features/dashboard/components/DebugTokenStatus.tsx**
   - Real-time polling (500ms interval)
   - Sync status tracking
   - Better diagnosis + recommendations

---

## 🔍 Testing Checklist

After applying fixes:

1. **First Login**
   - [ ] Go to `/login`
   - [ ] Enter credentials & login
   - [ ] Should redirect to `/dashboard`
   - [ ] Debug box should show ✅ SYNCED within 2-3 seconds
   - [ ] Analytics page should load data

2. **Refresh Page**
   - [ ] Page `/dashboard/analytics` → refresh (Ctrl+R)
   - [ ] Should NOT show unauthorized
   - [ ] Debug box should show ✅ SYNCED
   - [ ] Analytics data should still display

3. **Logout & Login Again**
   - [ ] Logout (clear session + localStorage)
   - [ ] Login again
   - [ ] Should sync token properly
   - [ ] Analytics should work

4. **Check Console**
   - [ ] F12 → Console tab
   - [ ] Should see logs:
     ```
     ✅ [TokenManager] Saving token to localStorage
     ✅ [TokenManager] Token verified: OK
     🔐 [Apollo authLink] Token found in localStorage
     ```

---

## 🚨 If Still Not Working

### Scenario 1: Debug box stuck on "⏳ SYNCING..."
```
Possible causes:
- TokenManager component not mounted
- useEffect still not triggering
- localStorage API blocked
- NextAuth session not setting accessToken

Check:
1. Is TokenManager rendered? (should be in lib/providers.tsx)
2. Check console for errors from TokenManager
3. Verify session.user has accessToken field (check NextAuth config)
```

### Scenario 2: Token Match Failed
```
localStorage Token ≠ Session Token

Possible causes:
- Multiple browser tabs interfering
- Session state corrupted
- Token refreshed but localStorage not updated

Fix:
localStorage.clear()
window.location.href = '/login'
```

### Scenario 3: Still Getting Unauthorized After Fix
```
Token saved to localStorage & Apollo sending header, but backend still unauthorized

Possible causes:
- Token expired/invalid
- Backend token validation changed
- CORS issue

Check:
1. Test token with curl command (see debugging guide)
2. Ask backend dev to check token validation logic
3. Verify token secret is same in frontend & backend
```

---

## 🧹 Cleanup

After confirming token persistence works:

1. Remove DebugTokenStatus component:
   ```
   // File: app/(dashboard)/dashboard/analytics/page.tsx
   // Remove: import DebugTokenStatus
   // Remove: <DebugTokenStatus />
   ```

2. Remove console.log from TokenManager & Apollo (optional, or keep for production logs)

3. Keep polling logic in DebugTokenStatus for other pages that need it

---

## 📚 Related Files

- `lib/auth.ts` - NextAuth credentials provider
- `lib/auth/TokenManager.tsx` - Token sync manager (FIXED)
- `lib/graphql/client.ts` - Apollo client (FIXED)
- `lib/providers.tsx` - Root provider that wraps app
- `features/dashboard/components/DebugTokenStatus.tsx` - Debug component (IMPROVED)
- `.env.local` - Backend endpoint config

---

## 🎓 Lessons Learned

1. **useEffect dependencies matter** - Object references can be unstable
2. **Polling can help with client-side state sync** - Useful for debugging async state
3. **Always read fresh from source** - Apollo shouldn't cache token read
4. **Detailed logging for debugging** - Essential for tracking async state changes
5. **Client-side token management** - Need multiple layers (session → localStorage → headers)
