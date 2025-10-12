
import { servicesApi } from "@/Services/api"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface User {
        role?: string;
        accessToken?: string;
    }
    interface Session {
        accessToken?: string;
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }
}


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password", placeholder: "**************" }
            },
            async authorize(credentials) {
                const res = await servicesApi.signIn(credentials?.email ?? "", credentials?.password ?? "")

                // If no error and we have user data, return it
                if (res.message == "success" && res.user) {
                    return {
                        id: res.user.email,
                        name: res.user.name,
                        email: res.user.email,
                        role: res.user.role,
                        accessToken: res.token,
                    }
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.role = token.role as string;
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET
})

export { handler as GET, handler as POST }