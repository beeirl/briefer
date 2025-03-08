import { apiRouter } from './api'
import { auth } from './auth'
import { domain } from './dns'

export const webapp = new sst.aws.StaticSite('Webapp', {
  path: './packages/webapp',
  build: {
    output: 'dist',
    command: 'bun run build',
  },
  domain: {
    name: 'app.' + domain,
    dns: sst.cloudflare.dns({
      proxy: $app.stage === 'production',
    }),
  },
  environment: {
    VITE_API_URL: apiRouter.url,
    VITE_AUTH_URL: auth.url,
    VITE_WEBSITE_URL: $dev ? 'http://localhost:4321' : 'https://' + domain,
  },
})
