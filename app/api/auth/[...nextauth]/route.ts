import NextAuth, {
  type NextAuthOptions,
  Account,
  Profile,
  Session,
  User,
  AdapterUser
} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'

interface CustomUser extends User {
  id: string
}

interface CustomSession extends Session {
  user?: CustomUser
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  callbacks: {
    session: ({
      session,
      token,
      user
    }: {
      session: Session
      token: JWT
      user: AdapterUser
    }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string
        }
      } as CustomSession
    },
    jwt: ({
      token,
      account,
      profile
    }: {
      token: JWT
      account: Account | null
      profile?: Profile
    }) => {
      if (account && profile?.sub) {
        token.sub = profile.sub
      }
      return token
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
