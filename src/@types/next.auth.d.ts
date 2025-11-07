import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface IUser {
    data: {
      token: string;
      user: User;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    token?: string;
  }

  interface JWT {
    token: string;
    user: User;
  }

  interface Session {
    token: string;
    user: User;
  }
}
