import { development, LensClient } from '@lens-protocol/client'

const lensClient = new LensClient({
  environment: development
})

export default lensClient
