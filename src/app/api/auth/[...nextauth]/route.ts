
import { servicesApi } from "@/Services/api"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
                        token: res.token,
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
                token.token = user.token;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            session.token = token.token as string;
            session.user.role = token.role as string;
            return session;
        }
    },
    secret: process.env.AUTH_SECRET
})

export { handler as GET, handler as POST }