import {
  MetadataAttributeInput,
  ProfileFragment,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'
import { useState } from 'react'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'

import getUserLocale from '../getUserLocale'
import uploadToIPFS from '../ipfs/ipfsUpload'
import { PostTags } from '../types'
import checkAuth from './checkAuth'
import getSignature from './getSignature'
import lensClient from './lensClient'
interface Props {
  publicationId: string
  organizationId: string
}

const useApply = (params: Props) => {
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const apply = async (
    profile: ProfileFragment | null,
    hoursToVerify: string,
    comments: string,
    close?: Function
  ) => {
    setIsLoading(true)
    try {
      if (profile === null) {
        throw Error('Provided profile is null!')
      }

      const attributes: MetadataAttributeInput[] = [
        {
          traitType: 'type',
          displayType: PublicationMetadataDisplayTypes.String,
          value: PostTags.VhrRequest.Opportunity
        },
        {
          traitType: 'hoursToVerify',
          displayType: PublicationMetadataDisplayTypes.Number,
          value: hoursToVerify
        },
        {
          traitType: 'comments',
          displayType: PublicationMetadataDisplayTypes.String,
          value: comments
        }
      ]
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: v4(),
        content: `#${PostTags.VhrRequest.Opportunity} #${params.organizationId}`,
        locale: getUserLocale(),
        tags: [PostTags.VhrRequest.Opportunity, params.organizationId],
        mainContentFocus: PublicationMainFocus.TextOnly,
        name: `${PostTags.VhrRequest.Opportunity} by ${profile.handle} for publication ${params.publicationId}`,
        attributes,
        appId: APP_NAME
      }

      await checkAuth(profile.ownedBy)

      const contentURI = await uploadToIPFS(metadata)

      const typedDataResult =
        await lensClient().publication.createCommentTypedData({
          profileId: profile.id,
          publicationId: params.publicationId,
          contentURI,
          collectModule: {
            freeCollectModule: {
              followerOnly: false
            }
          },
          referenceModule: { followerOnlyReferenceModule: false }
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      if (close) close()

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    setError,
    isLoading,
    apply
  }
}

export default useApply
