import {
  CollectModuleParams,
  isRelayerError,
  PublicationMetadataV2Input,
  ReferenceModuleParams,
  RelayerResultFragment
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { useTranslation } from 'react-i18next'

import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * Params for `createComment` returned by {@link useCreateComment}
 */
export interface CreateCommentParams {
  /**
   * The publication id of the publication to create the comment under
   */
  publicationId: string
  /**
   * The profile id of the profile creating the comment
   */
  profileId: string
  /**
   * The {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.PublicationMetadataV2Input.html | PublicationMetadataV2Input} for the comment
   */
  metadata: PublicationMetadataV2Input
  /**
   * {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.CollectModuleParams.html | CollectModuleParams} for the comment
   *
   * Defaults to
   * { freeCollectModule: { followerOnly: false } },
   */
  collectModule?: CollectModuleParams
  /**
   * {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ReferenceModuleParams.html | ReferenceModuleParams } for the comment
   *
   * Defaults to
   * { followerOnlyReferenceModule: false }
   */
  referenceModule?: ReferenceModuleParams
}

/**
 * Returned by the {@link useCreateComment} hook
 */
export interface CreateCommentReturn {
  /**
   *
   * @param params The {@link CreateCommentParams} for the request
   * @returns
   */
  createComment: (params: CreateCommentParams) => Promise<RelayerResultFragment>
}

/**
 * A hook that wraps {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData | createCommentTypedData}
 * to simplify to process of metadata upload with the thirdweb storage react hooks sdk,
 * signing, and broadcasting the transaction
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns CreateCommentReturn
 */

const useCreateComment = (): CreateCommentReturn => {
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
      throw new Error(typedDataResult.error.message)
    }

    const signature = await signTypedData(
      getSignature(typedDataResult.value.typedData)
    )

    const broadcastResult = await lensClient().transaction.broadcast({
      id: typedDataResult.value.id,
      signature
    })

    if (broadcastResult.isFailure()) {
      throw new Error(broadcastResult.error.message)
    } else if (isRelayerError(broadcastResult.value)) {
      throw new Error(broadcastResult.value.reason)
    } else {
      return broadcastResult.value
    }
  }

  return { createComment }
}

export default useCreateComment
