import { database } from './database'
import { allSecrets } from './secret'
import { assetStorage } from './storage'

export const bus = new sst.aws.Bus('Bus')

bus.subscribe('EventSubscriber', {
  handler: 'packages/functions/src/event.handler',
  link: [assetStorage, bus, database, ...allSecrets],
  timeout: '5 minutes',
})
