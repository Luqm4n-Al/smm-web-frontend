# 📡 GraphQL Schema — Peta Operasi per Fitur

> **Terakhir diperbarui:** 18 Mei 2026  
> **Maintainer:** Tim Frontend SMM Web

Referensi cepat untuk menjawab *"Query/Mutation apa yang dipakai di fitur X?"* — semua operasi GraphQL yang digunakan di frontend, dikelompokkan berdasarkan fitur.

---

## Daftar Isi

- [Ringkasan Statistik](#ringkasan-statistik)
- [1. Authentication](#1-authentication)
- [2. Dashboard (Overview)](#2-dashboard-overview)
- [3. Analytics](#3-analytics)
- [4. Insight](#4-insight)
- [5. Scheduling](#5-scheduling)
- [6. Profile](#6-profile)
- [7. Notifications](#7-notifications)
- [Peta Visual: Operasi → Komponen](#peta-visual-operasi--komponen)
- [Type Definitions](#type-definitions)
- [Indeks File](#indeks-file)

---

## Ringkasan Statistik

| Jenis         | Jumlah |
|---------------|--------|
| **Query**     | 5      |
| **Mutation**  | 14     |
| **Subscription** | 2   |
| **Total**     | **21** |

---

## 1. Authentication

> **Feature path:** `features/auth/graphql/`  
> **Halaman:** `/register`, `/verify-otp`, `/login`, `/change-password`, `/forgot-password/*`

### Mutations

| Operasi | Input Type | Return Type | File | Dipakai di |
|---------|-----------|-------------|------|------------|
| `register` | `RegisterInput!` | `UserRegister` | [register.mutation.ts](../features/auth/graphql/register.mutation.ts) | `RegisterForm` |
| `verifyOTP` | `OTPInput!` | `String` | [verify-otp.mutation.ts](../features/auth/graphql/verify-otp.mutation.ts) | `OtpVerificationForm` |
| `resendOTP` | `RegisterInput!` | `UserRegister` | [resend-otp.mutation.ts](../features/auth/graphql/resend-otp.mutation.ts) | `OtpVerificationForm` |
| `login` | `LoginInput!` | `TokenResponse` | [login.mutation.ts](../features/auth/graphql/login.mutation.ts) | `lib/auth.ts` (NextAuth) |
| `firebaseLogin` | `String!` | `TokenResponse` | [firebase-login.mutation.ts](../features/auth/graphql/firebase-login.mutation.ts) | `lib/auth.ts` (NextAuth) |
| `changePassword` | `ChangePasswordInput!` | `Boolean` | [change-password.mutation.ts](../features/auth/graphql/change-password.mutation.ts) | `ChangePasswordForm` |
| `forgotPassword` | `ForgotPasswordInput!` | `{ email, phone }` | [forgot-password.mutation.ts](../features/auth/graphql/forgot-password.mutation.ts) | `ForgotPasswordForm` |
| `verifyOTPForgotPassword` | `OTPInput!` | `String` (token) | [verify-forgot-otp.mutation.ts](../features/auth/graphql/verify-forgot-otp.mutation.ts) | `ForgotOtpVerificationForm` |
| `changeForgotenPassword` | `ChangeForgotenPasswordInput!` | `String` | [change-forgotten-password.mutation.ts](../features/auth/graphql/change-forgotten-password.mutation.ts) | `ResetPasswordForm` |

### Input Types

```typescript
// RegisterInput — registrasi user baru
{ email: string; username: string; phone: string }

// OTPInput — verifikasi OTP (register & forgot password)
{ phone: string; email: string; otp: string }

// LoginInput — login standar
{ username: string; password: string }

// ChangePasswordInput — ganti password (sudah login)
{ oldPassword: string; newPassword: string }

// ChangeForgotenPasswordInput — reset password (belum login, pakai OTP token)
{ otp: string; password: string }

// ForgotPasswordInput — minta OTP untuk forgot password
{ email: string; phone: string }
```

### Catatan Khusus

> ⚠️ Mutation `login` dan `firebaseLogin` **tidak** dipanggil via Apollo Client hook, melainkan langsung via `fetch()` di `lib/auth.ts` (NextAuth `authorize` callback). Ini karena NextAuth berjalan di server-side dan tidak memiliki akses ke Apollo Client context.

---

## 2. Dashboard (Overview)

> **Feature path:** `features/dashboard/graphql/`  
> **Halaman:** `/dashboard`  
> **Komponen utama:** `DashboardView.tsx`

### Queries

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `analytics` (GetAnalytics) | — | `Analytics` | [analytics.query.ts](../features/dashboard/graphql/analytics.query.ts) | `DashboardView`, `usePlatformData` |

### Subscriptions

| Operasi | Return Type | Protocol | File | Dipakai di |
|---------|-------------|----------|------|------------|
| `analyticsUpdated` | `Analytics` | WebSocket | [analytics.subscription.ts](../features/dashboard/graphql/analytics.subscription.ts) | `DashboardView` |

### Catatan

`DashboardView` menggunakan pola **query + subscription overlay**: data awal diambil via `GetAnalytics` query, lalu di-overlay dengan real-time update dari `AnalyticsUpdated` subscription. Komponen `usePlatformData` hook juga menggunakan query yang sama untuk data yang difilter per platform.

---

## 3. Analytics

> **Feature path:** `features/dashboard/graphql/`  
> **Halaman:** `/dashboard/analytics`  
> **Komponen utama:** `AnalyticsView.tsx`

### Queries

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `analytics` (GetAnalytics) | — | `Analytics` | [analytics.query.ts](../features/dashboard/graphql/analytics.query.ts) | `AnalyticsView` |

### Subscriptions

| Operasi | Return Type | File | Dipakai di |
|---------|-------------|------|------------|
| `analyticsUpdated` | `Analytics` | [analytics.subscription.ts](../features/dashboard/graphql/analytics.subscription.ts) | `AnalyticsView` |

### Return Fields (Analytics)

```graphql
analytics {
  socialMedia {
    instagram { followers, totalViews, totalLikes, sentiments { positive, neutral, negative } }
    tiktok    { followers, totalViews, totalLikes, sentiments { positive, neutral, negative } }
  }
  growthMatrix {
    followers { date, quantity }
    likes     { date, quantity }
    views     { date, quantity }
  }
  ageRange        { age, quantity }
  genderAudience  { gender, quantity }
  heatmap         { level, code, value }
}
```

---

## 4. Insight

> **Feature path:** `features/dashboard/graphql/`  
> **Halaman:** `/dashboard/insight`  
> **Komponen utama:** `InsightView.tsx`, `BlacklistPanel.tsx`

### Queries

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `posts` (GetPosts) | `PostFilter` | `PostAnalytics[]` | [posts.query.ts](../features/dashboard/graphql/posts.query.ts) | `InsightView` |
| `commentBlackLists` (GetCommentBlacklists) | — | `CommentBlackList[]` | [commentBlacklists.query.ts](../features/dashboard/graphql/commentBlacklists.query.ts) | `InsightView` |

### Mutations

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `addCommentBlackList` | `CommentBlackListInput!` | `CommentBlackList` | [add-blacklist.mutation.ts](../features/dashboard/graphql/add-blacklist.mutation.ts) | `BlacklistPanel` |
| `removeCommentBlackList` | `ID!` | `Boolean` | [remove-blacklist.mutation.ts](../features/dashboard/graphql/remove-blacklist.mutation.ts) | `BlacklistPanel` |

### PostFilter Input

```typescript
{
  platform?: 'INSTAGRAM' | 'TIKTOK';
  sortField?: 'DATE' | 'LIKE' | 'VIEW' | 'SENTIMENT';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}
```

### Catatan

Mutation `addCommentBlackList` dan `removeCommentBlackList` keduanya menggunakan `refetchQueries` untuk otomatis refresh `GetCommentBlacklists` setelah mutasi berhasil.

---

## 5. Scheduling

> **Feature path:** `features/dashboard/graphql/`  
> **Halaman:** `/dashboard/schedule`  
> **Komponen utama:** `ScheduleView.tsx`, `CreatePlanModal.tsx`, `PlanningList.tsx`

### Queries

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `contentSchedules` (GetContentSchedules) | — | `ContentSchedule[]` | [content-schedules.query.ts](../features/dashboard/graphql/content-schedules.query.ts) | `ScheduleView` |

### Mutations

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `createContentSchedule` | `CreateContentScheduleInput!` | `ContentSchedule` | [create-schedule.mutation.ts](../features/dashboard/graphql/create-schedule.mutation.ts) | `CreatePlanModal` |
| `updateContentSchedule` | `ID!`, `UpdateContentScheduleInput!` | `ContentSchedule` | [update-schedule.mutation.ts](../features/dashboard/graphql/update-schedule.mutation.ts) | `CreatePlanModal` |
| `deleteContentSchedule` | `ID!` | `Boolean` | [delete-schedule.mutation.ts](../features/dashboard/graphql/delete-schedule.mutation.ts) | `PlanningList` |
| `markContentScheduleAsPosted` | `ID!` | `ContentSchedule` | [mark-posted.mutation.ts](../features/dashboard/graphql/mark-posted.mutation.ts) | `PlanningList` |

### Schedule Input Types

```typescript
// CreateContentScheduleInput
{ title: string; caption?: string; fileUrl?: string; scheduledUpload?: string }

// UpdateContentScheduleInput
{ title?: string; caption?: string; fileUrl?: string; scheduledUpload?: string }
```

### Return Fields (ContentSchedule)

```graphql
contentSchedules {
  id
  title
  caption
  fileUrl
  status          # DRAFT | SCHEDULED | POSTED
  scheduledUpload
  createdAt
}
```

---

## 6. Profile

> **Feature path:** `features/profile/graphql/`  
> **Halaman:** `/dashboard/profile`  
> **Komponen utama:** `ProfileForm.tsx`

### Queries

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `UserInfo` (GetProfile) | — | `UserProfile` | [get-profile.query.ts](../features/profile/graphql/get-profile.query.ts) | `ProfileForm` |

### Mutations

| Operasi | Input | Return Type | File | Dipakai di |
|---------|-------|-------------|------|------------|
| `changeAvatar` | `Upload!` | `String` | [change-avatar.mutation.ts](../features/profile/graphql/change-avatar.mutation.ts) | `ProfileForm` |
| `changePhoneNumber` | `String!` | `String` | [change-phone.mutation.ts](../features/profile/graphql/change-phone.mutation.ts) | `ProfileForm` |
| `changeSocialMediaAccount` | `[SocialAccountInput!]!` | `String` | [change-social-account.mutation.ts](../features/profile/graphql/change-social-account.mutation.ts) | `ProfileForm` |

### Return Fields (UserProfile)

```graphql
UserInfo {
  username
  email
  avatar
  phone
  social_account {
    platform
    username
    api_key
  }
}
```

### Catatan

`ProfileForm` adalah satu-satunya komponen yang menggunakan **semua 4 operasi** Profile sekaligus (1 query + 3 mutations). Semua mutation Profile dipanggil dari form yang sama.

---

## 7. Notifications

> **Feature path:** `features/notifications/hooks/`  
> **Komponen utama:** *Belum terintegrasi ke UI* (hook sudah siap)

### Subscriptions

| Operasi | Return Type | Protocol | File | Dipakai di |
|---------|-------------|----------|------|------------|
| `newComment` | `NewCommentData` | WebSocket | [useNewCommentSubscription.ts](../features/notifications/hooks/useNewCommentSubscription.ts) | *Belum dipakai* |

### Return Fields

```graphql
newComment {
  id
  text
  author {
    name
  }
}
```

### Catatan

> ⚠️ Hook `useNewCommentSubscription` sudah dibuat tapi **belum dipanggil** dari komponen manapun. Ini adalah fitur yang siap diintegrasikan ke notification panel atau toast system.

---

## Peta Visual: Operasi → Komponen

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION                               │
│                                                                     │
│  RegisterForm ─────── register, resendOTP (via OtpVerificationForm) │
│  OtpVerificationForm ─ verifyOTP, resendOTP                        │
│  LoginForm ─────────── login, firebaseLogin (via lib/auth.ts)       │
│  ChangePasswordForm ── changePassword                               │
│  ForgotPasswordForm ── forgotPassword                               │
│  ForgotOtpForm ─────── verifyOTPForgotPassword                      │
│  ResetPasswordForm ─── changeForgotenPassword                       │
├─────────────────────────────────────────────────────────────────────┤
│                        DASHBOARD                                    │
│                                                                     │
│  DashboardView ─────── GetAnalytics (Q) + AnalyticsUpdated (S)      │
│  usePlatformData ───── GetAnalytics (Q)                             │
├─────────────────────────────────────────────────────────────────────┤
│                        ANALYTICS                                    │
│                                                                     │
│  AnalyticsView ─────── GetAnalytics (Q) + AnalyticsUpdated (S)      │
├─────────────────────────────────────────────────────────────────────┤
│                        INSIGHT                                      │
│                                                                     │
│  InsightView ──────── GetPosts (Q) + GetCommentBlacklists (Q)       │
│  BlacklistPanel ───── addCommentBlackList (M)                       │
│                       removeCommentBlackList (M)                    │
├─────────────────────────────────────────────────────────────────────┤
│                        SCHEDULING                                   │
│                                                                     │
│  ScheduleView ──────── GetContentSchedules (Q)                      │
│  CreatePlanModal ───── createContentSchedule (M)                    │
│                        updateContentSchedule (M)                    │
│  PlanningList ──────── deleteContentSchedule (M)                    │
│                        markContentScheduleAsPosted (M)              │
├─────────────────────────────────────────────────────────────────────┤
│                        PROFILE                                      │
│                                                                     │
│  ProfileForm ──────── GetProfile (Q)                                │
│                       changeAvatar (M)                              │
│                       changePhoneNumber (M)                         │
│                       changeSocialMediaAccount (M)                  │
├─────────────────────────────────────────────────────────────────────┤
│                        NOTIFICATIONS                                │
│                                                                     │
│  (belum terintegrasi) ── NewComment (S)                             │
└─────────────────────────────────────────────────────────────────────┘

Legenda: (Q) = Query  |  (M) = Mutation  |  (S) = Subscription
```

---

## Type Definitions

Semua TypeScript type definitions yang digunakan oleh operasi GraphQL:

| File | Types | Digunakan oleh |
|------|-------|----------------|
| [auth.types.ts](../features/auth/graphql/auth.types.ts) | `LoginInput`, `TokenResponse`, `RegisterInput`, `UserRegister`, `OTPInput`, `OTPResponse`, `ChangePasswordInput` | Auth mutations |
| [analytics.types.ts](../features/dashboard/graphql/analytics.types.ts) | `Analytics`, `SocialMediaStats`, `PlatformStats`, `SentimentDistribution`, `GrowthMatrix`, `GrowthValue`, `AgeRangeStat`, `GenderStat`, `Heatmap` | Analytics query & subscription |
| [insight.types.ts](../features/dashboard/graphql/insight.types.ts) | `PostAnalytics`, `PostFilter`, `CommentBlackList` | Insight queries & mutations |
| [schedule.types.ts](../features/dashboard/graphql/schedule.types.ts) | `ContentSchedule`, `CreateContentScheduleInput`, `UpdateContentScheduleInput`, `ScheduleStatus` | Scheduling query & mutations |
| [profile.types.ts](../features/profile/graphql/profile.types.ts) | `UserProfile`, `SocialAccount`, `SocialAccountInput` | Profile query & mutations |

---

## Indeks File

Daftar lengkap semua file GraphQL di project, diurutkan per direktori:

### `features/auth/graphql/`

| File | Tipe | Operasi |
|------|------|---------|
| `auth.types.ts` | Types | — |
| `register.mutation.ts` | Mutation | `register` |
| `verify-otp.mutation.ts` | Mutation | `verifyOTP` |
| `resend-otp.mutation.ts` | Mutation | `resendOTP` |
| `login.mutation.ts` | Mutation | `login` |
| `firebase-login.mutation.ts` | Mutation | `firebaseLogin` |
| `change-password.mutation.ts` | Mutation | `changePassword` |
| `forgot-password.mutation.ts` | Mutation | `forgotPassword` |
| `verify-forgot-otp.mutation.ts` | Mutation | `verifyOTPForgotPassword` |
| `change-forgotten-password.mutation.ts` | Mutation | `changeForgotenPassword` |

### `features/dashboard/graphql/`

| File | Tipe | Operasi |
|------|------|---------|
| `analytics.types.ts` | Types | — |
| `insight.types.ts` | Types | — |
| `schedule.types.ts` | Types | — |
| `analytics.query.ts` | Query | `GetAnalytics` |
| `analytics.subscription.ts` | Subscription | `AnalyticsUpdated` |
| `posts.query.ts` | Query | `GetPosts` |
| `commentBlacklists.query.ts` | Query | `GetCommentBlacklists` |
| `content-schedules.query.ts` | Query | `GetContentSchedules` |
| `create-schedule.mutation.ts` | Mutation | `CreateContentSchedule` |
| `update-schedule.mutation.ts` | Mutation | `UpdateContentSchedule` |
| `delete-schedule.mutation.ts` | Mutation | `DeleteContentSchedule` |
| `mark-posted.mutation.ts` | Mutation | `MarkContentScheduleAsPosted` |
| `add-blacklist.mutation.ts` | Mutation | `AddCommentBlackList` |
| `remove-blacklist.mutation.ts` | Mutation | `RemoveCommentBlackList` |

### `features/profile/graphql/`

| File | Tipe | Operasi |
|------|------|---------|
| `profile.types.ts` | Types | — |
| `get-profile.query.ts` | Query | `GetProfile` |
| `change-avatar.mutation.ts` | Mutation | `ChangeAvatar` |
| `change-phone.mutation.ts` | Mutation | `ChangePhoneNumber` |
| `change-social-account.mutation.ts` | Mutation | `ChangeSocialMediaAccount` |

### `features/notifications/hooks/`

| File | Tipe | Operasi |
|------|------|---------|
| `useNewCommentSubscription.ts` | Subscription | `NewComment` |

---

> **💡 Tips:** Saat menambahkan query/mutation baru, pastikan untuk:
> 1. Membuat file terpisah di folder `graphql/` fitur terkait
> 2. Buat custom hook (`useXxxQuery` / `useXxxMutation`) di file yang sama
> 3. Definisikan TypeScript types di file `*.types.ts` yang relevan
> 4. **Update dokumen ini** agar tetap akurat
