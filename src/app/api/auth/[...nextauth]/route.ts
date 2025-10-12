import { servicesApi } from "@/Services/api"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface User {
        id?: string;
        role?: string;
        accessToken?: string;
        phone?: string | null;
    }

    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            phone?: string | null;
        };
    }
}

const handler = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
        updateAge: 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password", placeholder: "**************" },
            },
            async authorize(credentials) {
                const res = await servicesApi.signIn(
                    credentials?.email ?? "",
                    credentials?.password ?? ""
                );

                if (res.message === "success" && res.user) {
                    return {
                        id: res.user._id || res.user.id,
                        name: res.user.name,
                        email: res.user.email,
                        role: res.user.role,
                        accessToken: res.token,
                        phone: res.user.phone,
                    };
                }
                return null;
            },
        }),
    ],
    pages: { signIn: "/auth/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.id = user.id;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.role = token.role as string;
            session.user.id = token.id as string;
            session.user.phone = token.phone as string;
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});


export { handler as GET, handler as POST };
