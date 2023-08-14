import {
  CollectModuleParams,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { useTranslation } from 'react-i18next'

import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * Params for createComment returned by useCreateComment
 */
export interface CreateCommentParams {
  publicationId: string
  profileId: string
  metadata: PublicationMetadataV2Input
  collectModule?: CollectModuleParams
  referenceModule?: ReferenceModuleParams
}

/**
 * A hook that wraps createCommentTypedData {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData}
 * to simply allow for metadata upload with the thirdweb storage react hooks sdk,
 * to automatically sign and broadcast the result.
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns the result from broadcasting the transaction
 */

const useCreateComment = () => {
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()

  const createComment = async ({
    publicationId,
    profileId,
    metadata,
    collectModule = { freeCollectModule: { followerOnly: false } },
    referenceModule = { followerOnlyReferenceModule: false }
  }: CreateCommentParams) => {
    if (!sdk) throw new Error(e('metadata-upload-fail'))
    const contentURI = sdk.storage.resolveScheme(
      (await upload({ data: [metadata] }))[0]
    )

    if (!contentURI) throw new Error(e('metadata-upload-fail'))

    console.log(contentURI)

    const typedDataResult =
      await lensClient().publication.createCommentTypedData({
        publicationId,
        profileId,
        contentURI,
        collectModule,
        referenceModule
      })

    if (typedDataResult.isFailure()) {
      console.log('not authed')
    }

    const signature = await signTypedData(
      getSignature(typedDataResult.unwrap().typedData)
    )

    const broadcastResult = await lensClient().transaction.broadcast({
      id: typedDataResult.unwrap().id,
      signature: signature
    })

    return broadcastResult
  }

  return { createComment }
}

export default useCreateComment
