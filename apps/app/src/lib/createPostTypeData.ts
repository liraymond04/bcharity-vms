import { development, LensClient } from '@lens-protocol/client'

const client = new LensClient({
  environment: development
})

const createPostTypeData = () => {
  return client.publication.createPostTypedData
}

export default createPostTypeData

export { client }
