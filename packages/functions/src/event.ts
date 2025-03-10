import { withActor } from '@briefer/core/actor'
import { Brief } from '@briefer/core/brief/index'
import { bus } from 'sst/aws/bus'

export const handler = bus.subscriber([Brief.Event.Created, Brief.Event.Updated], async (event) =>
  withActor(event.metadata.actor, async () => {
    switch (event.type) {
      case Brief.Event.Created.type:
      case Brief.Event.Updated.type:
        await Brief.generateBlocks(event.properties.briefID)
        break
    }
  })
)
