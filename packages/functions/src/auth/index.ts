import { Email } from '@briefer/core/email'
import { User } from '@briefer/core/user/index'
import { issuer } from '@openauthjs/openauth'
import { CodeProvider } from '@openauthjs/openauth/provider/code'
import { GoogleOidcProvider } from '@openauthjs/openauth/provider/google'
import { handle } from 'hono/aws-lambda'
import { Resource } from 'sst'
import { subjects } from './subjects'

const auth = issuer({
  subjects,
  providers: {
    code: CodeProvider<{ email: string }>({
      length: 6,
      request: async (req, state, form, error) => {
        const url = new URL(process.env.WEBAPP_URL!)
        url.pathname = {
          start: '/auth/code',
          code: '/auth/code/verify',
        }[state.type]
        if (error) url.searchParams.set('error', error.type)
        return new Response(null, {
          headers: {
            Location: url.toString(),
          },
          status: 302,
        })
      },
      sendCode: async (claims, code) => {
        console.log(claims, code)
        if (!process.env.SST_DEV) {
          await Email.send(
            'auth',
            claims.email,
            `Briefer Pin Code: ${code}`,
            `Your pin code is ${code}`
          )
        }
      },
    }),
    google: GoogleOidcProvider({
      clientID: Resource.GoogleClientID.value,
      scopes: ['openid', 'email', 'profile'],
    }),
  },
  allow: async (input) => {
    if (process.env.SST_DEV) return true
    const hostname = new URL(input.redirectURI).hostname
    if (hostname.endsWith('formelguru.de')) return true
    if (hostname === 'localhost') return true
    return false
  },
  success: async (ctx, value) => {
    let email: string | undefined
    let firstName: string | undefined
    let lastName: string | undefined
    switch (value.provider) {
      case 'code':
        email = value.claims.email
        break
      case 'google': {
        const idToken = value.id as any
        email = idToken.email
        firstName = idToken.given_name
        lastName = idToken.family_name
        break
      }
    }

    if (email) {
      const user = await User.fromEmail(email)
      if (!user) {
        const id = await User.create({
          email,
          firstName,
          lastName,
        })
        return ctx.subject('user', {
          userID: id,
        })
      }
      return ctx.subject('user', {
        userID: user.id,
      })
    }

    return new Response('Something went wrong', { status: 500 })
  },
})

export const handler = handle(auth)
