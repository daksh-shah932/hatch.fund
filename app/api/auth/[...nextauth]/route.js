import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "@/app/models/User";
import Payment from "@/app/models/Payment";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          // ✅ Connect to MongoDB
          await mongoose.connect(process.env.MONGODB_URI);

          // ✅ Ensure email exists
          const email = user.email || profile.email;
          if (!email) {
            console.error("GitHub did not return an email.");
            return false;
          }

          // ✅ Check if user already exists
          let existingUser = await User.findOne({ email });

          // ✅ Create new user if needed
          if (!existingUser) {
            const newUser = new User({
              email,
              username: email.split("@")[0],
              profilepic: user.image,
            });
            await newUser.save();
            // console.log("✅ New user created:", newUser.username);
          }

          return true;
        } catch (err) {
          console.error("Database error:", err);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      await mongoose.connect(process.env.MONGODB_URI);
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.name = dbUser.username;        // 🔥 FIXED
        session.user.username = dbUser.username;    // (optional backup)
      }

      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
