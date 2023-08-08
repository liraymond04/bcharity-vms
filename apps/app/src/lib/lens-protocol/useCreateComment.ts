import {
  CollectModuleParams,
  PublicationMetadataV2Input,
  ReferenceModuleParams
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'

import getSignature from './getSignature'
import lensClient from './lensClient'

const useCreateComment = () => {
  const { mutateAsync: upload } = useStorageUpload()

  const createComment = async (
    publicationId: string,
    profile: Profile,
    metadata: PublicationMetadataV2Input,
    collectModule: CollectModuleParams = {
      freeCollectModule: { followerOnly: false }
    },
    referenceModule: ReferenceModuleParams = {
      followerOnlyReferenceModule: false
    }
  ) => {
    const contentURI = (await upload({ data: [metadata] }))[0]

    const profileId: string = profile.id

    const typedDataResult =
      await lensClient().publication.createCommentTypedData({
        publicationId,
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

  return { createComment }
}

export default useCreateComment
