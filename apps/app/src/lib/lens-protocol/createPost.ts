import {
  CollectModuleParams,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'

import uploadToIPFS from '../ipfsUpload'
import getSignature from './getSignature'
import lensClient from './lensClient'

const createPost = async (
  profile: Profile,
  metadata: PublicationMetadataV2Input,
  collectModule: CollectModuleParams,
  referenceModule: ReferenceModuleParams
) => {
  const contentURI = await uploadToIPFS(metadata)

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

export default createPost
