# Analytics Data Fetching - Debugging Guide

## 🔴 ERROR: Unauthorized

**Error Response:**
```json
{
  "errors": [{ "message": "unauthorized" }],
  "data": null
}
```

Ini berarti **authentication header tidak valid atau tidak dikirim ke backend**.

### Penyebab Umum
1. **Token belum disimpan ke localStorage** - Session belum sepenuhnya ter-load
2. **Token sudah expired** - Perlu login ulang
3. **Token format salah** - Bukan format JWT yang valid
4. **Header name salah** - Backend mengharapkan nama header berbeda

### Quick Fix Steps

#### Langkah 1: Lihat Debug Box Token Status
- Buka `/dashboard/analytics`
- Lihat **di kanan bawah** - ada debug box warna gelap dengan token status
- Tunggu 2-3 detik sampai ter-sync

**Debug Box menunjukkan:**
```
🔍 Token Debug Status
NextAuth Status: authenticated ✅
Session Access Token: eyJhbGciOiJI...
localStorage Token: eyJhbGciOiJI...
Auth Header Sent: Bearer eyJhbGciOiJI...
📋 Diagnosis: ✅ Token ada, siap untuk GraphQL
```

#### Langkah 2: Interpretasi Debug Status
- ✅ **Semua hijau** = Token OK, lanjut ke Langkah 3
- ⚠️ **"Session ada tapi token belum di-localStorage"** = Tunggu 3 detik atau refresh
- ❌ **"Belum login"** = Pergi ke `/login` terlebih dahulu
- ❌ **"Invalid JWT format"** = Token rusak, login ulang

#### Langkah 3: Verify Network Request
- Buka DevTools → **Network tab**
- Refresh page `/dashboard/analytics`
- Cari request ke `query` atau `http://192.168.100.114:8080/query`
- Klik request tersebut
- Tab **Request Headers** → cari baris `authorization`
- Harus ada: `authorization: Bearer eyJ...`

**Jika authorization header ada tapi masih unauthorized:**
- Backend token validation mungkin reject token
- Token format mungkin tidak sesuai backend expectation
- Backend CORS mungkin tidak setup dengan benar

#### Langkah 4: Test dengan Curl (untuk backend dev)
```bash
# Copy token dari localStorage
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Test query
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { analytics { socialMedia { instagram { followers } } } }"}' \
  http://192.168.100.114:8080/query
```

Jika curl juga unauthorized, masalah ada di backend token validation.

---

## Token Flow Architecture

```
1. User Login di /login
   ↓ CredentialsProvider call backend login mutation
   ↓
2. Backend return access_token & refresh_token
   ↓ NextAuth JWT callback store token
   ↓
3. Session callback membuat token accessible dari session
   ↓ Frontend read session.user.accessToken
   ↓
4. TokenManager.tsx simpan ke localStorage["token"]
   ↓ Apollo Client authLink read localStorage
   ↓
5. Apollo Client add Authorization header
   ↓ GraphQL request dikirim ke backend
   ↓
6. Backend validate token & return data
```

Jika ada masalah di step 4, token tidak akan dikirim.

---

## Complete Debugging Checklist

### 1. **Backend Connectivity** 🌐
- [ ] Backend server berjalan di `http://192.168.100.114:8080`
- [ ] Test endpoint dengan curl (lihat di atas)

### 2. **NextAuth Session** 🔐
- [ ] Sudah login ke `/login`
- [ ] DevTools → Application → Cookies → Cari `next-auth.session-token`
- [ ] Token harus ada dan bukan empty

### 3. **Token Storage** 💾
- [ ] DevTools → Application → localStorage
- [ ] Cari key `token`
- [ ] Value harus dimulai dengan `ey...` (JWT format)
- [ ] Value tidak boleh empty atau "undefined"

### 4. **Apollo Client Config** ⚙️
- [ ] `.env.local` punya: `NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://192.168.100.114:8080/query`
- [ ] File: `lib/graphql/client.ts` membaca env dengan benar
- [ ] authLink seharusnya read dari localStorage

### 5. **Network Request** 🌐
- [ ] DevTools → Network tab
- [ ] Refresh `/dashboard/analytics`
- [ ] Cari request ke `/query` endpoint
- [ ] **Request Headers**:
  - [ ] Method: POST
  - [ ] Content-Type: application/json
  - [ ] authorization: Bearer <token> ← PENTING!
- [ ] **Response**:
  - [ ] Status: 200
  - [ ] Body bukan "unauthorized"

### 6. **Error Messages** 📋
Buka DevTools → Console tab:
- [ ] Lihat error atau warning messages
- [ ] Format: `❌ [hookName] Error...`
- [ ] Screenshot error message

### 7. **GraphQL Query** 📊
Backend response harus ada salah satu:

**Success:**
```json
{"data": {"analytics": {"socialMedia": {...}}}}
```

**No data (tapi token valid):**
```json
{"data": {"analytics": null}}
```

**Query error:**
```json
{"errors": [{"message": "Field 'analytics' not found"}]}
```

**Auth error:**
```json
{"errors": [{"message": "unauthorized"}]}
```

---

## Common Issues & Fixes

| Issue | Debug | Fix |
|-------|-------|-----|
| Unauthorized di Network | Check authorization header | Login ulang di `/login` |
| Token ada di localStorage tapi unauthorized | Test dengan curl | Backend mungkin reject format |
| Token tidak ada di localStorage | Check NextAuth session | Tunggu TokenManager sync (3 detik) |
| Loading terus menerus | Check console errors | Cek Network tab untuk response |
| No data tapi token valid | Query return null | Backend belum crawl social media data |

---

## Files Reference

1. **Authentication Setup:**
   - `lib/auth.ts` - NextAuth config & CredentialsProvider
   - `lib/auth/TokenManager.tsx` - Sync session token ke localStorage
   - `lib/graphql/client.ts` - Apollo Client dengan authLink

2. **Analytics Queries:**
   - `features/dashboard/graphql/analytics.query.ts` - GET_ANALYTICS_QUERY
   - `features/dashboard/graphql/analytics.types.ts` - Type definitions
   - `features/dashboard/hooks/useAnalyticsData.ts` - Data hooks

3. **Components:**
   - `features/dashboard/components/DebugTokenStatus.tsx` - Debug component
   - `app/(dashboard)/dashboard/analytics/page.tsx` - Analytics page

4. **Config:**
   - `.env.local` - Backend endpoint URL

---

## Debug Component

**DebugTokenStatus.tsx** hanya muncul di development environment (browser).

Menampilkan:
- ✅ NextAuth session status
- ✅ Token dari session
- ✅ Token di localStorage
- ✅ Authorization header yang akan dikirim
- ✅ JWT format validation
- ✅ Otomatis diagnosis + rekomendasi

**Lokasi:** Kanan bawah analytics page

**Remove setelah testing:**
```
// File: app/(dashboard)/dashboard/analytics/page.tsx
// Hapus: import DebugTokenStatus
// Hapus: <DebugTokenStatus /> component
```

---

## Troubleshooting Workflow

1. **Buka analytics page**
   → Lihat debug box di kanan bawah

2. **Token status OK?**
   → Ya: Lanjut step 3
   → Tidak: Follow diagnosis dari debug box

3. **Check Network tab**
   → Cari request ke `/query`
   → Verify authorization header ada

4. **Authorization header ada?**
   → Ya: Masalah di backend token validation
   → Tidak: Token tidak ter-sync, refresh page

5. **Backend dev: Test dengan curl**
   → Verify backend accept token format
   → Check token validation logic
   → Check CORS settings

6. **Still unauthorized?**
   → Lihat backend logs untuk error details
   → Verify token secret/key sama di frontend & backend
   → Check token expiry time

---

## Next Action Items

- [ ] Refresh `/dashboard/analytics`
- [ ] Cek debug box untuk token status
- [ ] Jika token OK, check Network tab untuk authorization header
- [ ] Jika header ada, test dengan curl
- [ ] Jika curl berhasil, masalah di frontend (cek Apollo config)
- [ ] Jika curl gagal, masalah di backend (cek token validation)
