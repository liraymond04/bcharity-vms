import {
  CollectModuleParams,
  ProfileFragment,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { useTranslation } from 'react-i18next'

import getSignature from './getSignature'
import lensClient from './lensClient'

const useCreatePost = () => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const sdk = useSDK()
  const { mutateAsync: upload } = useStorageUpload()

  const createPost = async (
    profile: ProfileFragment,
    metadata: PublicationMetadataV2Input,
    collectModule: CollectModuleParams = {
      freeCollectModule: { followerOnly: false }
    },
    referenceModule: ReferenceModuleParams = {
      followerOnlyReferenceModule: false
    }
  ) => {
    const contentURI = sdk?.storage.resolveScheme(
      (await upload({ data: [metadata] }))[0]
    )

    if (!contentURI) throw e('metadata-upload-fail')

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
    const profileId: string = profile.id

    // or with typedData that require signature and broadcasting
    const typedDataResult = await lensClient().publication.createPostTypedData({
      profileId,
      contentURI,
      collectModule,
      referenceModule
    })

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
