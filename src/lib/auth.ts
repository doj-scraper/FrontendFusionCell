import 'server-only'

import type { NextAuthOptions } from 'next-auth'

import { env } from '@/lib/env'

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [],
  pages: {
    signIn: '/login',
  },
}
