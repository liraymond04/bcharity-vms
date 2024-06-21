import { isRelaySuccess } from '@lens-protocol/client'
import { LegacyCollectRequest } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'

import { config } from '@/lib/config'

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
  const request: LegacyCollectRequest = {
    on: publicationId
  }
  const typedDataResult =
    await lensClient().publication.createLegacyCollectTypedData(request)

  const signature = await signTypedData(
    config,
    getSignature(typedDataResult.unwrap().typedData)
  )

  const broadcastResult = await lensClient().transaction.broadcastOnchain({
    id: typedDataResult.unwrap().id,
    signature: signature
  })

  if (broadcastResult.isFailure()) {
    throw new Error(broadcastResult.error.message)
  } else if (!isRelaySuccess(broadcastResult.value)) {
    throw new Error(broadcastResult.value.reason)
  } else {
    return broadcastResult.value
  }
}

export default createCollect
