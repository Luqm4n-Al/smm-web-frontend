// Konfigurasi authentication menggunakan NextAuth
import type { NextAuthOptions } from 'next-auth';

// Provider untuk login menggunakan username & password (custom backend)
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Extend tipe bawaan NextAuth
 * 
 * Tujuan:
 * Menambahkan accessToken & refreshToken ke dalam:
 * - User
 * - Session
 */
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
  }
}

/**
 * Extend tipe JWT
 * 
 * Token JWT akan menyimpan accessToken & refreshToken
 * agar bisa digunakan di request selanjutnya
 */
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}

/**
 * Konfigurasi utama NextAuth
 */
export const authOptions: NextAuthOptions = {
  // Secret untuk enkripsi session/token
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * Provider authentication
   * Menggunakan Credentials (login manual via username & password)
   */
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      // Field input yang digunakan di halaman login
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      /**
       * Fungsi authorize
       * 
       * Mendukung 2 mode login:
       * 1. Regular: username + password → mutation login
       * 2. Firebase: firebaseIdToken + '__firebase__' → mutation firebaseLogin
       */
      async authorize(credentials) {
        // Validasi input
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const isFirebaseLogin = credentials.password === '__firebase__';

        // Pilih query berdasarkan mode login
        const query = isFirebaseLogin
          ? `
            mutation FirebaseLogin($input: String!) {
              firebaseLogin(input: $input) {
                access_token
                refresh_token
              }
            }
          `
          : `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                access_token
                refresh_token
              }
            }
          `;

        const variables = isFirebaseLogin
          ? { input: credentials.username } // username berisi Firebase ID token
          : { input: { username: credentials.username, password: credentials.password } };

        // Request ke GraphQL endpoint
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
          });

          // Cek HTTP response status
          if (!res.ok) {
            return null;
          }

          const { data, errors } = await res.json();

          // Cek GraphQL errors
          if (errors?.length) {
            return null;
          }

          // Extract token dari response (firebaseLogin atau login)
          const loginData = isFirebaseLogin ? data?.firebaseLogin : data?.login;

          if (loginData) {
            return {
              id: isFirebaseLogin ? 'firebase-user' : credentials.username,
              accessToken: loginData.access_token,
              refreshToken: loginData.refresh_token,
            };
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],

  /**
   * Callbacks
   * Digunakan untuk mengontrol data token & session
   */
  callbacks: {
    /**
     * JWT Callback
     * 
     * Dipanggil saat:
     * - Login
     * - Request berikutnya
     * 
     * Tujuan:
     * Menyimpan accessToken & refreshToken ke dalam JWT
     */
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    /**
     * Session Callback
     * 
     * Tujuan:
     * Mengirim token dari JWT ke session (client-side)
     * agar bisa diakses di frontend
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  /**
   * Custom halaman authentication
   */
  pages: {
    signIn: '/login',
  },

  /**
   * Konfigurasi session
   * Menggunakan JWT (tanpa database session)
   */
  session: {
    strategy: 'jwt',
  },
};