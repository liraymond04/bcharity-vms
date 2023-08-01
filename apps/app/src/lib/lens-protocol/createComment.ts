import {
  CollectModuleParams,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'

import uploadToIPFS from '../ipfs/ipfsUpload'
import getSignature from './getSignature'
import lensClient from './lensClient'

const createComment = async (
  publicationId: string,
  profile: Profile,
  metadata: PublicationMetadataV2Input,
  collectModule?: CollectModuleParams,
  referenceModule?: ReferenceModuleParams
) => {
  const contentURI = await uploadToIPFS(metadata)

  const profileId: string = profile.id

  const typedDataResult = await lensClient().publication.createCommentTypedData(
    {
      publicationId,
      profileId,
      contentURI,
      collectModule: collectModule ?? {
        freeCollectModule: {
          followerOnly: false
        }
      },
      referenceModule: referenceModule ?? { followerOnlyReferenceModule: false }
    }
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

export default createComment
