import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/connect";
// import User from "@/db/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: process.env.NEXTAUTH_EMAIL || { label: "Email", type: "text" },
        password: process.env.NEXTAUTH_PASSWORD || { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(credentials.email === process.env.NEXTAUTH_EMAIL && credentials.password === process.env.NEXTAUTH_PASSWORD) {
          return {
            id: "1",
            email: "jonas.dally@mail.de",
            role: "admin",
            lastname: "Jonas",
            firstname: "Dally",
          };
        }
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Kein Benutzer mit dieser E-Mail gefunden.");
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Falsches Passwort.");
        }


        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          lastname: user.lastname,
          firstname: user.firstname,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.lastname = user.lastname;
        token.firstname = user.firstname;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.lastname = token.lastname;
      session.user.firstname = token.firstname;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
};

export default NextAuth(authOptions);
