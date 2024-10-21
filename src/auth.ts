import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Cognito],
	callbacks: {
		async jwt({ token, user, profile }) {
			if (user && profile) {
				token.email = user.email
				token.name = profile['cognito:username'] as string;
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.name = token.name as string;
				session.user.email = token.email as string;
			}
			return session;
		}
	}
})