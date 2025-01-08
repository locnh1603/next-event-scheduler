import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    async profile(profile) {
      console.log(profile)
      return { ...profile }
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      try {
        await fetch("http://localhost:5000/user", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(session.user)
        });
      } catch (e) {
        console.log(e);
      }
      return session;
    },
  },
})
