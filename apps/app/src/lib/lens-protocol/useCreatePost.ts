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
 * Params for `createPost` returned by {@link useCreatePost}
 */
export interface CreatePostParams {
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
   * The {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ReferenceModuleParams.html | ReferenceModuleParams } for the comment
   *
   * Defaults to
   * { followerOnlyReferenceModule: false }
   */
  referenceModule?: ReferenceModuleParams
}

/**
 * Returned by the {@link useCreatePost} hook
 */
export interface CreatePostReturn {
  /**
   *
   * @param params The {@link CreatePostParams} for the request
   * @returns
   */
  createPost: (params: CreatePostParams) => Promise<RelayerResultFragment>
}
/**
 * A hook that wraps createPostTypedData {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData}
 * to simplify to process of metadata upload with the thirdweb storage react hooks sdk,
 * signing, and broadcasting the transaction
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns the result from broadcasting the transaction
 */

const useCreatePost = (): CreatePostReturn => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const sdk = useSDK()
  const { mutateAsync: upload } = useStorageUpload()

  const createPost = async ({
    profileId,
    metadata,
    collectModule = { freeCollectModule: { followerOnly: false } },
    referenceModule = { followerOnlyReferenceModule: false }
  }: CreatePostParams) => {
    if (!sdk) throw new Error(e('metadata-upload-fail'))

    const contentURI = sdk?.storage.resolveScheme(
      (await upload({ data: [metadata] }))[0]
    )

    if (!contentURI) throw new Error(e('metadata-upload-fail'))

    console.log(contentURI)
    // create a post via dispatcher, you need to have the dispatcher enabled for the profile
    // const viaDispatcherResult =
    //   await lensClient.publication.createPostViaDispatcher({
    //     profileId,
    //     contentURI,
    //     collectModule: {
    //       revertCollectModule: true // collect disabled
    //     },
    //     referenceModule: {
    //       followerOnlyReferenceModule: false // anybody can comment or mirror
    //     }
    //   })

    // or with typedData that require signature and broadcasting
    const typedDataResult = await lensClient().publication.createPostTypedData({
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

  return { createPost }
}

export default useCreatePost
