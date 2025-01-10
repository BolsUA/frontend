import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Cognito],
    callbacks: {
        async jwt({ token, profile, account }) {
            if (profile && account) {
                // First-time login
                return {
					...token,
                    user_id: profile.sub as string,
                    groups: profile['cognito:groups'] as string[],
					accessToken: account.access_token,
					expiresAt: account.expires_at,
					refreshToken: account.refresh_token,
				}
            }

            // @ts-expect-error expiredAt is defined
			if (Date.now() < token.expiresAt * 1000) return token;

            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.user_id as string,
                name: token.name as string,
                email: token.email as string,
                // @ts-expect-error groups is not defined in the default user type
                groups: token.groups as string[],
            }

            // @ts-expect-error Session does not have accessToken
			session.accessToken = token.accessToken as string;
			// @ts-expect-error Session does not have expiresAt
			session.expiresAt = token.expiresAt;

            return session;
        }
    }
})