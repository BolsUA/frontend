import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Cognito],
    callbacks: {
        async jwt({ token, user, profile }) {
            if (user && profile) {
                token.email = user.email
                token.name = profile.name
                token.groups = profile['cognito:groups'] as string[];
                token.sub = profile.sub as string
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                // @ts-expect-error groups is not defined in the default user type
                session.user.groups = token.groups as string[];
                session.user.id = token.sub as string;
            }
            return session;
        }
    }
})