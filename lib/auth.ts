// lib/auth.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend User type
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
  interface Session {
    user: User;
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        //Untuk mengembalikan objek user dengan token
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
                        password: credentials.password
                    } }, 
            }),
        });

        const { data } = await res.json();
        if (data?.login) {
            return {
                id: credentials.username,
                accessToken: data.login.access_token,
                refreshToken: data.login.refresh_token,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
        }
        return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};