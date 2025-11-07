/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { AXIOS_INSTANCE } from '@/services/api';

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Credenciais não fornecidas.');

        try {
          const response = await AXIOS_INSTANCE.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { accessToken, entity } = response.data;

          if (!entity || !accessToken) {
            throw new Error('Falha na autenticação: usuário ou token ausente.');
          }

          return { ...entity, token: accessToken };
        } catch (error: any) {
          throw new Error(error?.response?.data?.message || 'Falha na autenticação.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
        token.token = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      if (token.token) {
        session.token = token.token as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
