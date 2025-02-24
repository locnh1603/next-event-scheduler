import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import "next-auth/jwt"
import {MongooseAdapter} from '@/lib/mongoose.adapter';
import dbConnect from '@/lib/dbConnect';
import { env } from '@env';
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongooseAdapter(),
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET
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

