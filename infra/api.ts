import { auth } from './auth'
import { database } from './database'
import { domain } from './dns'
import { secret } from './secret'
import { publicStorage } from './storage'

export const api = new sst.aws.Function('Api', {
  handler: './packages/functions/src/api/index.handler',
  link: [auth, database, publicStorage, secret.TwelvelabsApiKey],
  streaming: !$dev,
  url: true,
})

export const apiRouter = new sst.aws.Router('ApiRouter', {
  domain: {
    name: 'api.' + domain,
    dns: sst.cloudflare.dns({
      proxy: $app.stage === 'production',
    }),
  },
  routes: {
    '/*': api.url,
  },
})
