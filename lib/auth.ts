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
       * Dipanggil saat user login
       * Bertugas:
       * - Mengirim request ke backend (GraphQL)
       * - Mengambil access_token & refresh_token
       * - Mengembalikan data user jika login berhasil
       */
      async authorize(credentials) {
        // Validasi input
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Request ke GraphQL endpoint (mutation login)
        const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({
            query: `
              mutation Login($input: LoginInput!) {
                login(input: $input) {
                  access_token
                  refresh_token
                }
              }
            `,
            variables: {
              input: {
                username: credentials.username,
                password: credentials.password,
              },
            },
          }),
        });

        const { data } = await res.json();

        // Jika login berhasil, kembalikan object user + token
        if (data?.login) {
          return {
            id: credentials.username,
            accessToken: data.login.access_token,
            refreshToken: data.login.refresh_token,
          };
        }

        // Jika gagal, return null → login dianggap gagal
        return null;
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