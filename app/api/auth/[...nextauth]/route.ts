import NextAuth, { type NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export const authOptions: NextAuthOptions = {
  pages: {
  error: "/auth/error",
},
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret:
        process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      if (!profile?.id) {
        return false;
      }

      const { data: existingProfile } =
        await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("discord_id", profile.id)
          .maybeSingle();

      // Only Discord accounts already added
      // to Reale are allowed to sign in.
      if (!existingProfile) {
        return false;
      }

      return true;
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.discordId = profile.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.discordId =
          token.discordId as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };