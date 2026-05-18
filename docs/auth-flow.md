# 🔐 Authentication Flow — SMM Web

> **Terakhir diperbarui:** 18 Mei 2026  
> **Maintainer:** Tim Frontend SMM Web

Dokumentasi ini menjelaskan seluruh alur autentikasi pada aplikasi SMM Web, termasuk keputusan arsitektur penting dan panduan troubleshooting.

---

## Daftar Isi

- [1. Gambaran Umum](#1-gambaran-umum)
- [2. Alur Registrasi (Happy Path)](#2-alur-registrasi-happy-path)
- [3. Diagram Alur](#3-diagram-alur)
- [4. Penjelasan Setiap Tahap](#4-penjelasan-setiap-tahap)
- [5. "Aturan Ganjil" — Mengapa Login Ulang Setelah Ganti Password?](#5-aturan-ganjil--mengapa-login-ulang-setelah-ganti-password)
- [6. Alur Forgot Password](#6-alur-forgot-password)
- [7. Google Sign-In (Firebase)](#7-google-sign-in-firebase)
- [8. Rate Limiter & Troubleshooting](#8-rate-limiter--troubleshooting)
- [9. Referensi File](#9-referensi-file)

---

## 1. Gambaran Umum

Sistem autentikasi SMM Web menggunakan arsitektur berlapis:

| Layer           | Teknologi                     | Fungsi                                   |
|-----------------|-------------------------------|------------------------------------------|
| **Frontend**    | Next.js (App Router)          | UI forms, routing, state management      |
| **Auth Session**| NextAuth.js (JWT strategy)    | Manajemen session, token storage         |
| **API**         | GraphQL (Apollo Client)       | Komunikasi dengan backend                |
| **OAuth**       | Firebase Auth + Google OAuth  | Login via Google                         |
| **Middleware**  | NextAuth Middleware            | Proteksi route `/dashboard/*`            |

---

## 2. Alur Registrasi (Happy Path)

Alur lengkap dari user baru mendaftar hingga masuk ke dashboard:

```
Register → OTP → Login Paksa → Ganti Password → Login Lagi → Dashboard
```

Total ada **5 langkah** sebelum user baru bisa mengakses dashboard. Ini memang terasa panjang, tapi setiap langkah punya alasan keamanan yang jelas (lihat bagian [Aturan Ganjil](#5-aturan-ganjil--mengapa-login-ulang-setelah-ganti-password)).

---

## 3. Diagram Alur

### Alur Registrasi User Baru

```
┌──────────────┐
│   /register  │  User mengisi: username, email, phone
│              │  Mutation: register(input)
└──────┬───────┘
       │ Sukses → Backend kirim OTP ke email
       ▼
┌──────────────┐
│  /verify-otp │  User masukkan 6-digit OTP dari email
│              │  Mutation: verifyOTP(input)
└──────┬───────┘
       │ Sukses → Backend kirim temporary password ke email
       │          Redirect ke /login?welcome=true
       ▼
┌──────────────────┐
│ /login?welcome   │  User login dengan username +
│   =true          │  temporary password dari email
│                  │  NextAuth → mutation login(input)
└──────┬───────────┘
       │ Sukses → Deteksi welcome=true
       │          Redirect ke /change-password
       ▼
┌──────────────────┐
│ /change-password │  User ganti temporary password
│                  │  dengan password baru
│                  │  Mutation: changePassword(input)
└──────┬───────────┘
       │ Sukses → signOut() → hapus session lama
       │          Redirect ke /login?passwordChanged=true
       ▼
┌──────────────────────┐
│ /login?password      │  User login ulang dengan
│   Changed=true       │  password baru
│                      │  NextAuth → mutation login(input)
└──────┬───────────────┘
       │ Sukses → Deteksi passwordChanged=true
       │          Langsung ke dashboard
       ▼
┌──────────────┐
│  /dashboard  │  ✅ Akses penuh ke aplikasi
└──────────────┘
```

### Alur Forgot Password

```
┌─────────────────┐
│/forgot-password  │  User masukkan email + phone
│                  │  Mutation: forgotPassword(input)
└──────┬───────────┘
       │ Sukses → Backend kirim OTP ke email
       ▼
┌──────────────────────────┐
│/forgot-password/verify   │  User masukkan 6-digit OTP
│                          │  Mutation: verifyOTPForgotPassword(input)
└──────┬───────────────────┘
       │ Sukses → Dapat token reset
       ▼
┌──────────────────────────┐
│/forgot-password/reset    │  User masukkan password baru
│  ?token=xxx              │  Mutation: changeForgotenPassword(input)
└──────┬───────────────────┘
       │ Sukses → Redirect ke /login
       ▼
┌──────────────┐
│    /login    │  Login dengan password baru
└──────────────┘
```

---

## 4. Penjelasan Setiap Tahap

### 4.1 Register (`/register`)

- **Input:** username, email, phone
- **Mutation:** `register(input: RegisterInput!)`
- **Respons:** Backend mengirim kode OTP ke email user
- **Redirect:** `/verify-otp?email=...&phone=...&username=...`
- **Catatan:** Tidak ada field password saat register. Backend yang akan generate temporary password setelah OTP diverifikasi.

### 4.2 Verifikasi OTP (`/verify-otp`)

- **Input:** kode OTP 6 digit (dari email)
- **Mutation:** `verifyOTP(input: OTPInput!)`
- **Fitur tambahan:**
  - Countdown timer 60 detik sebelum resend
  - Tombol "Resend Code" via mutation `resendOTP(input: RegisterInput!)`
  - Apollo cache di-reset saat user klik "Back to Register"
- **Respons sukses:** Backend mengirim temporary password ke email
- **Redirect:** `/login?welcome=true`

### 4.3 Login Paksa Pertama (`/login?welcome=true`)

- **Tujuan:** Membuktikan user memiliki akses ke email (untuk menerima temporary password)
- **UI khusus:**
  - Header berubah menjadi *"Welcome! Please Sign In"*
  - Muncul petunjuk: *"Use the username and temporary password sent to your email"*
  - Info: *"You will be asked to change your password after signing in"*
- **Proses:** NextAuth `signIn('credentials', ...)` → backend mutation `login(input)`
- **Redirect:** Karena `welcome=true`, setelah login sukses langsung diarahkan ke `/change-password`

### 4.4 Ganti Password (`/change-password`)

- **Input:** Old Password (temporary), New Password, Confirm New Password
- **Validasi client-side:**
  - Password baru minimal 8 karakter
  - Password wajib ada 1 angka, 1 huruf kapital, dan 1 simbol
  - Password baru harus cocok dengan konfirmasi
  - Password baru tidak boleh sama dengan password lama
- **Mutation:** `changePassword(input: ChangePasswordInput!)`
- **Setelah sukses:**
  1. Panggil `signOut({ redirect: false })` — **sesi dihancurkan**
  2. Redirect ke `/login?passwordChanged=true`
- **⚠️ Ini adalah "Aturan Ganjil" — lihat penjelasan lengkap di bawah**

### 4.5 Login Ulang (`/login?passwordChanged=true`)

- **Tujuan:** Membuat session JWT baru dengan kredensial password yang benar
- **Proses:** Login biasa, tapi setelah sukses langsung redirect ke `/dashboard` (karena `passwordChanged=true`, tidak diarahkan ke change-password lagi)

---

## 5. "Aturan Ganjil" — Mengapa Login Ulang Setelah Ganti Password?

> **Keputusan Arsitektur:** Setelah user berhasil mengganti password, session saat ini **dihancurkan** dan user **wajib login ulang** dengan password baru.

### Alasan Teknis

```
                Session JWT lama
                ┌─────────────────────────┐
                │ accessToken: "abc123"    │ ← Token ini di-issue
                │ refreshToken: "xyz789"   │   dengan password LAMA
                └─────────────────────────┘
                          │
                     Ganti Password
                          │
                          ▼
              Password di backend BERUBAH
              tapi JWT masih menyimpan token
              yang di-issue dari password lama
                          │
                          ▼
              ┌───────────────────────────┐
              │ SOLUSI: Destroy session   │
              │ → Login ulang            │
              │ → Dapat JWT baru         │
              │   dari password baru     │
              └───────────────────────────┘
```

1. **Token Invalidation:** JWT yang di-issue saat login menggunakan temporary password **mungkin** sudah di-invalidate oleh backend setelah password berubah. Jika kita tetap menggunakan token lama, request berikutnya bisa gagal dengan error `401 Unauthorized`.

2. **Session Integrity:** NextAuth menyimpan `accessToken` dan `refreshToken` di dalam JWT callback. Token-token ini adalah hasil dari login dengan password lama. Setelah password berubah, token baru harus di-generate dari password baru agar konsisten.

3. **Security Best Practice:** Ini adalah prinsip keamanan standar — setelah perubahan kredensial, semua session yang ada harus diakhiri untuk mencegah session hijacking. Jika session lama tetap aktif setelah password berubah, maka siapa pun yang memiliki token lama masih bisa mengakses akun.

4. **NextAuth Limitation:** NextAuth dengan JWT strategy tidak menyediakan mekanisme untuk "mengganti" token di tengah session tanpa re-authentication. Cara paling aman adalah `signOut()` → `signIn()` ulang.

### Mengapa Tidak Langsung ke Dashboard?

```
❌ OPSI YANG DITOLAK:
   Ganti Password → Langsung Dashboard (token lama masih aktif)
   Risiko: Token lama bisa expired/invalid kapan saja

✅ OPSI YANG DIPILIH:
   Ganti Password → signOut → Login Ulang → Dashboard (token baru)
   Benefit: Token selalu fresh dan valid
```

### Bagaimana LoginForm Menangani Routing?

```typescript
// LoginForm.tsx — Logika routing setelah login sukses
if (justChangedPassword) {
    // Password sudah berubah, langsung ke dashboard
    router.push('/dashboard');
} else if (isFirstLogin) {
    // User baru verifikasi OTP, arahkan ke change-password
    router.push('/change-password');
} else {
    // Regular login, go to dashboard
    router.push('/dashboard');
}
```

Query parameter `welcome` dan `passwordChanged` berfungsi sebagai **state flag** yang menentukan kemana user harus diarahkan setelah login berhasil.

---

## 6. Alur Forgot Password

Alur ini terpisah dari alur registrasi dan digunakan saat user lupa password:

| Langkah | Route                         | Mutation                          | Penjelasan                              |
|---------|-------------------------------|-----------------------------------|-----------------------------------------|
| 1       | `/forgot-password`            | `forgotPassword(input)`           | Input email + phone, kirim OTP          |
| 2       | `/forgot-password/verify`     | `verifyOTPForgotPassword(input)`  | Input OTP, dapat reset token            |
| 3       | `/forgot-password/reset`      | `changeForgotenPassword(input)`   | Input password baru, token sebagai auth |
| 4       | `/login`                      | `login(input)`                    | Login dengan password baru              |

### Perbedaan dengan Change Password (Post-Register)

| Aspek              | Change Password (Register)           | Forgot Password                    |
|--------------------|--------------------------------------|------------------------------------|
| **Trigger**        | Setelah registrasi + OTP             | Dari halaman login                 |
| **Auth State**     | User sudah login (punya session)     | User belum login                   |
| **Mutation**       | `changePassword` (butuh oldPassword) | `changeForgotenPassword` (pakai token OTP) |
| **Setelah Sukses** | `signOut()` + login ulang            | Langsung redirect ke `/login`      |

---

## 7. Google Sign-In (Firebase)

Google Sign-In mem-bypass seluruh alur OTP dan change password:

```
Google Popup → Firebase Auth → ID Token → NextAuth signIn
    → Backend mutation: firebaseLogin(input: String!)
    → Dapat access_token + refresh_token
    → Langsung ke /dashboard
```

### Detail Teknis

- **Frontend:** `signInWithPopup(auth, googleProvider)` dari Firebase SDK
- **NextAuth:** Credentials provider dengan flag `password: '__firebase__'`
- **Backend:** Mutation `firebaseLogin` menerima Firebase ID token dan mengembalikan JWT pair
- **Catatan:** Google Sign-In tersedia di halaman Register dan Login

---

## 8. Rate Limiter & Troubleshooting

### Masalah: "Too Many Attempts" / Error 429

Backend menggunakan rate limiter untuk melindungi endpoint autentikasi. Saat development atau testing, kita bisa terkena rate limit karena:

- Terlalu sering mengirim OTP (register, resend, forgot password)
- Terlalu sering percobaan login gagal
- Terlalu sering memanggil mutation yang sama dalam waktu singkat

### Gejala

| Gejala                                             | Kemungkinan Penyebab                 |
|----------------------------------------------------|--------------------------------------|
| Error `"Too many requests"` atau HTTP 429          | Rate limit tercapai                  |
| OTP tidak terkirim tapi tidak ada error message    | Rate limit silent fail               |
| Login selalu gagal padahal kredensial benar         | Account temporarily locked           |
| Mutation GraphQL mengembalikan error tanpa detail   | Rate limit di level server           |

### Solusi

#### 1. Tunggu (Paling Simpel)

```
Biasanya rate limit akan reset dalam 1-5 menit.
Tunggu beberapa saat sebelum mencoba lagi.
```

#### 2. Ganti Endpoint / Environment

Jika menggunakan environment development, periksa apakah backend memiliki endpoint staging yang memiliki rate limit lebih longgar:

```env
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://staging-api.example.com/graphql
```

#### 3. Gunakan Data Unik

Saat testing registrasi, gunakan email dan username berbeda setiap kali:

```
# Pattern yang bagus untuk testing
Username: testuser_{timestamp}
Email:    testuser_{timestamp}@example.com
Phone:    08xx-xxxx-{random}
```

#### 4. Reset Apollo Cache

Jika state terasa "stuck", reset Apollo cache:

```typescript
import { apolloClient } from '@/lib/graphql/apollo-client';
await apolloClient.resetStore();
```

#### 5. Clear Session NextAuth

Jika session bermasalah setelah terkena rate limit:

```
1. Buka browser DevTools → Application → Cookies
2. Hapus cookie: next-auth.session-token
3. Refresh halaman
```

Atau secara programatik:

```typescript
import { signOut } from 'next-auth/react';
await signOut({ redirect: false });
```

### Pencegahan

- **Countdown timer:** OTP form sudah memiliki countdown 60 detik sebelum izinkan resend
- **Disable button:** Semua tombol submit di-disable saat loading untuk mencegah double-submit
- **Error handling:** Gunakan `extractErrorMessage()` dari `lib/error-utils.ts` untuk menampilkan pesan error yang jelas

---

## 9. Referensi File

### Komponen Auth

| File                           | Fungsi                                                |
|--------------------------------|-------------------------------------------------------|
| `features/auth/components/RegisterForm.tsx`          | Form registrasi (email, username, phone)  |
| `features/auth/components/OtpVerificationForm.tsx`   | Form verifikasi OTP (registrasi)          |
| `features/auth/components/LoginForm.tsx`             | Form login + routing logic               |
| `features/auth/components/ChangePasswordForm.tsx`    | Form ganti password (post-registrasi)     |
| `features/auth/components/ForgotPasswordForm.tsx`    | Form forgot password (input email+phone)  |
| `features/auth/components/ForgotOtpVerificationForm.tsx` | Form OTP forgot password           |
| `features/auth/components/ResetPasswordForm.tsx`     | Form reset password (forgot password flow)|
| `features/auth/components/AuthPreview.tsx`           | Panel preview di sisi kiri halaman auth   |

### GraphQL Mutations

| File                                              | Mutation                        |
|---------------------------------------------------|---------------------------------|
| `features/auth/graphql/register.mutation.ts`      | `register`                      |
| `features/auth/graphql/verify-otp.mutation.ts`    | `verifyOTP`                     |
| `features/auth/graphql/resend-otp.mutation.ts`    | `resendOTP`                     |
| `features/auth/graphql/change-password.mutation.ts` | `changePassword`              |
| `features/auth/graphql/forgot-password.mutation.ts` | `forgotPassword`              |
| `features/auth/graphql/verify-forgot-otp.mutation.ts` | `verifyOTPForgotPassword`   |
| `features/auth/graphql/change-forgotten-password.mutation.ts` | `changeForgotenPassword` |
| `features/auth/graphql/auth.types.ts`             | Type definitions                |

### Konfigurasi & Infrastruktur

| File                                       | Fungsi                                       |
|--------------------------------------------|----------------------------------------------|
| `lib/auth.ts`                              | NextAuth options (providers, callbacks, JWT)  |
| `app/api/auth/[...nextauth]/route.ts`      | NextAuth API route handler                   |
| `middleware.ts`                             | Proteksi route `/dashboard/*`                |
| `lib/firebase.ts`                          | Firebase config (Google Sign-In)             |
| `lib/graphql/apollo-client.ts`             | Apollo Client setup                          |
| `lib/error-utils.ts`                       | Utilitas extract error message               |

### Halaman (Routes)

| Route                         | Page File                                  |
|-------------------------------|--------------------------------------------|
| `/register`                   | `app/(landing)/register/page.tsx`          |
| `/verify-otp`                 | `app/(landing)/verify-otp/page.tsx`        |
| `/login`                      | `app/(landing)/login/page.tsx`             |
| `/change-password`            | `app/(landing)/change-password/page.tsx`   |
| `/forgot-password`            | `app/(landing)/forgot-password/page.tsx`   |
| `/forgot-password/verify`     | `app/(landing)/forgot-password/verify/page.tsx` |
| `/forgot-password/reset`      | `app/(landing)/forgot-password/reset/page.tsx`  |

---

> **💡 Tip:** Jika kamu baru bergabung di tim dan bingung dengan alur yang panjang ini — itu normal. Alur ini sengaja dibuat berlapis untuk memastikan keamanan. Kunci utamanya ada di [Aturan Ganjil](#5-aturan-ganjil--mengapa-login-ulang-setelah-ganti-password): setiap perubahan kredensial **harus** menghasilkan session baru.
