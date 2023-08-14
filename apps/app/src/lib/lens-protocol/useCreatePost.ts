import {
  CollectModuleParams,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'

import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * Params for createPost returned by useCreatePost
 */
export interface CreatePostParams {
  profileId: string
  metadata: PublicationMetadataV2Input
  collectModule?: CollectModuleParams
  referenceModule?: ReferenceModuleParams
}

/**
 * A hook that wraps createPostTypedData {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData}
 * to simply allow for metadata upload with the thirdweb storage react hooks sdk,
 * to automatically sign and broadcast the result.
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns the result from broadcasting the transaction
 */

const useCreatePost = () => {
  const sdk = useSDK()
  const { mutateAsync: upload } = useStorageUpload()

  const createPost = async ({
    profileId,
    metadata,
    collectModule = { freeCollectModule: { followerOnly: false } },
    referenceModule = { followerOnlyReferenceModule: false }
  }: CreatePostParams) => {
    const contentURI = sdk?.storage.resolveScheme(
      (await upload({ data: [metadata] }))[0]
    )

    if (!contentURI) throw new Error('Metadata upload failed')

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

  return { createPost }
}

export default useCreatePost
