import { signTypedData } from '@wagmi/core'

import getSignature from './getSignature'
import lensClient from './lensClient'

const createCollect = async (publicationId: string) => {
  const typedDataResult = await lensClient().publication.createCollectTypedData(
    { publicationId }
  )

  const signature = await signTypedData(
    getSignature(typedDataResult.unwrap().typedData)
  )

  const broadcastResult = await lensClient().transaction.broadcast({
    id: typedDataResult.unwrap().id,
    signature: signature
  })

  return broadcastResult
}

export default createCollect
