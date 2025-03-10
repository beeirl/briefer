import { auth } from './auth'
import { bus } from './bus'
import { database } from './database'
import { domain } from './dns'
import { secret } from './secret'
import { assetStorage } from './storage'

export const api = new sst.aws.Function('Api', {
  handler: './packages/functions/src/api/index.handler',
  link: [assetStorage, auth, bus, database, secret.GeminiApiKey, secret.TwelvelabsApiKey],
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
