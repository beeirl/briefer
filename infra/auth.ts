import { database } from './database'
import { domain } from './dns'
import { email } from './email'
import { secret } from './secret'

export const auth = new sst.aws.Auth('Auth', {
  authorizer: {
    environment: {
      WEBAPP_URL: $dev ? 'http://localhost:5173' : 'https://app.' + domain,
    },
    handler: './packages/functions/src/auth/index.handler',
    link: [email, database, secret.GoogleClientID],
    permissions: [
      {
        actions: ['ses:SendEmail'],
        resources: ['*'],
      },
    ],
  },
  domain: {
    name: 'auth.' + domain,
    dns: sst.cloudflare.dns({
      proxy: $app.stage === 'production',
    }),
  },
  forceUpgrade: 'v2',
})
