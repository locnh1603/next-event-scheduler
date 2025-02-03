import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import "next-auth/jwt"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return { ...profile }
      }
    }),
  ],
  callbacks: {
    jwt({ token, profile, account }) {
      if (profile) {
        token.picture = profile.picture;
      }
      if (account) {
        console.log(account.providerAccountId);
        token.provider = account.provider;
      }
      return token;
    },
    async session({session, token}) {
      session.user.id = token.sub as string;
      // @ts-expect-error: next auth does types allows extension but does not respect the typing
      session.user.provider = token.provider as string;
      return session;
    },
  },
  session: {
    strategy: "jwt"
  }
})

