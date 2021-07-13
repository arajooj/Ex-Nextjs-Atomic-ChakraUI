import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { Logger } from './../../../util/logger'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    })
  ],
  secret: "X3G08YVpBnN6Sob6yLaTkf-6XLE1oFsvq241Q0oWuY4",
  jwt: {
    secret: "X3G08YVpBnN6Sob6yLaTkf-6XLE1oFsvq241Q0oWuY4",
  },
  session: {
    jwt: true,
    maxAge: 2 * 60 * 60 // 30 days
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (account.provider === 'google' &&
        profile.verified_email === true &&
        profile.email.endsWith('@catral.com.br')) {
        return true
      } else {
        return false
      }
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    }
  },
  events: {
    async signIn(message) { 
      Logger.SESSION.login(message.user.email)
    },
    async signOut(message) { /* on signout */ },
    async createUser(message) { /* user created */ },
    async updateUser(message) { /* user updated - e.g. their email was verified */ },
    async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
    async session(message) { /* session is active */ },
    async error(message) { /* error in authentication flow */ }
  }
})