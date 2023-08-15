import { signTypedData } from '@wagmi/core'

import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * A function to handle the creation, signing, and broadcasting of lens collects
 * also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createCollectTypedData}
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * to prevent authentication errors
 * @param publicationId The id of the publication to collect
 *
 * @returns The result from broadcasting the transaction
 */
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
