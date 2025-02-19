import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import "next-auth/jwt"
import {MongooseAdapter} from '@/lib/mongoose.adapter';
import dbConnect from '@/lib/dbConnect';
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongooseAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  events: {
    async signIn() {
      await dbConnect(); // Ensure database is connected
    },
  },
  session: {
    strategy: "jwt"
  }
})

