/// <reference path="./.sst/platform/config.d.ts" />

import { readdirSync } from 'fs'

export default $config({
  app(input) {
    return {
      name: 'briefer',
      home: 'aws',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      providers: {
        aws: {
          profile: process.env.GITHUB_ACTIONS
            ? undefined
            : input.stage === 'production'
              ? 'briefer-production'
              : 'briefer-dev',
          region: 'us-east-1',
        },
        cloudflare: true,
        planetscale: true,
      },
    }
  },
  async run() {
    const output = {}
    for (const file of readdirSync('./infra/')) {
      const module = await import('./infra/' + file)
      if (module.output) Object.assign(output, module.output)
    }
    return output
  },
})
