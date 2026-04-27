# Analytics Data Fetching - Debugging Guide

## Query Structure Verification ✅

Query GraphQL yang digunakan **sudah sesuai dengan backend schema**:

```graphql
query GetAnalytics {
  analytics {
    socialMedia {
      instagram { followers, totalViews, totalLikes, sentiments { positive, neutral, negative } }
      tiktok { followers, totalViews, totalLikes, sentiments { positive, neutral, negative } }
    }
    growthMatrix { followers { date, quantity }, likes { date, quantity }, views { date, quantity } }
    ageRange { age, quantity }
    genderAudience { gender, quantity }
    heatmap { level, code, value }
  }
}
```

## Debugging Checklist

### 1. **Backend Connectivity** 🌐
- [ ] Backend server berjalan di `http://192.168.100.114:8080`
- [ ] Test dengan curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://192.168.100.114:8080/query \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"query":"query { analytics { socialMedia { instagram { followers } } } }"}'
```

### 2. **Authentication & Token** 🔐
- [ ] Login berhasil dan token disimpan di localStorage
- [ ] Check browser DevTools → Application → localStorage → cari key "token"
- [ ] Token harus dimulai dengan `ey...` (JWT format)
- [ ] Check Network tab saat request `/query` → Request Headers harus ada `authorization: Bearer <token>`

### 3. **Apollo Client Configuration** ⚙️
- [ ] `.env.local` harus punya: `NEXT_PUBLIC_GRAPHQL_ENDPOINT = "http://192.168.100.114:8080/query"`
- [ ] File: `lib/graphql/client.ts` menggunakan env variable dengan benar
- [ ] Check: `setContext` di Apollo Link sedang membaca token dari localStorage

### 4. **Error Logging** 📋
Buka browser Console (F12 → Console) dan lihat error messages:

```
✅ If you see: 🔄 [useSentimentData] Loading...
   → Normal, data sedang di-fetch

❌ If you see error messages dengan format:
   ❌ [useSentimentData] Error fetching sentiment data: {
     message: "...",
     graphQLErrors: [...],
     networkError: {...}
   }
   → Ada masalah dengan API
```

### 5. **Network Tab Inspection** 🔍
- [ ] Open DevTools → Network tab
- [ ] Refresh page `/dashboard/analytics`
- [ ] Cari request ke `/query` (type: fetch/xhr)
- [ ] Check Request:
  - Headers ada `authorization`?
  - Method: POST?
  - Content-Type: application/json?
- [ ] Check Response:
  - Status 200?
  - Ada data di response?
  - Ada errors field di response?

### 6. **GraphQL Response Structure** 📊

**Success Response (200) - Data ada:**
```json
{
  "data": {
    "analytics": {
      "socialMedia": {
        "instagram": { "followers": 1000, ... },
        "tiktok": { "followers": 500, ... }
      },
      ...
    }
  }
}
```

**Success Response (200) - Data null/kosong:**
```json
{
  "data": {
    "analytics": null
  }
}
```
→ Backend tidak return data, cek user punya data analytics atau belum

**Error Response (200) - GraphQL Error:**
```json
{
  "errors": [{
    "message": "Field 'analytics' is required",
    "extensions": { "code": "GRAPHQL_VALIDATION_ERROR" }
  }]
}
```
→ Query structure tidak sesuai backend schema

**Error Response (401/403):**
```json
{
  "errors": [{ "message": "Unauthorized" }]
}
```
→ Token invalid atau tidak ada permission

### 7. **Data Availability** 📈
Setelah fix connectivity issues, cek apakah backend punya data:
- Instagram followers harus > 0
- TikTok followers harus > 0
- Age range harus ada entries
- Gender audience harus ada entries
- Heatmap harus ada entries

Jika semua 0 atau kosong → Backend belum crawl data dari social media

## Quick Fix Checklist

### If data tidak muncul:
1. **Token issue?** → Clear localStorage, login ulang
2. **Endpoint salah?** → Verify `.env.local` 
3. **Backend down?** → Test dengan curl command
4. **Query structure?** → Check query field names match schema exactly
5. **No data?** → Backend belum crawl/sync dari Instagram/TikTok

### Console Logging untuk Debugging
Semua hooks sekarang punya logging otomatis:
- `console.log('🔄 [useSentimentData] Loading...')` → saat fetch
- `console.error('❌ [useSentimentData] Error...', error)` → saat error

Lihat console untuk melihat progress.

## Files Modified

1. **analytics.types.ts** - Added PostAnalytics types & enums
2. **analytics.query.ts** - Added GET_POSTS_QUERY & useGetPostsQuery
3. **useAnalyticsData.ts** - Added error logging & useEffect debugging

## Next Steps

Setelah analytics data berhasil:
1. Implementasi hooks untuk posts/insight
2. Update dashboard page dengan real data
3. Add error boundaries untuk handle failure states
4. Test with actual social media data
