import {
  MetadataAttributeInput,
  ProfileFragment,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { useState } from 'react'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'
import { LogVhrRequestMetadataRecord, PostTags } from '@/lib/metadata'

import getUserLocale from '../getUserLocale'
import { MetadataVersion } from '../types'
import checkAuth from './checkAuth'
import useCreateComment from './useCreateComment'

export interface UseLogHoursParams {
  /**
   * The id of the publication that created the request
   */
  publicationId: string
  /**
   * The organization that published this opportunity
   */
  organizationId: string
}

import { useTranslation } from 'react-i18next'
/**
 * A react hook to handle making VHR log requests
 *
 * @param params The params for the requests
 * @returns
 */
const useLogHours = (params: UseLogHoursParams) => {
  const [error, setError] = useState<string>()

  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const [isLoading, setIsLoading] = useState<boolean>()

  const { createComment } = useCreateComment()

  const logHours = async (
    profile: ProfileFragment | null,
    hoursToVerify: string,
    comments: string,
    onSuccess?: VoidFunction
  ) => {
    setIsLoading(true)
    setError('')
    try {
      if (profile === null) {
        throw Error(e('profile-null'))
      }

      const data: LogVhrRequestMetadataRecord = {
        type: PostTags.VhrRequest.Opportunity,
        version: MetadataVersion.LogVhrRequestMetadataVersions['1.0.0'],
        hoursToVerify,
        comments
      }

      const attributes: MetadataAttributeInput[] = Object.entries(data).map(
        ([k, v]) => {
          return {
            traitType: k,
            value: v,
            displayType: PublicationMetadataDisplayTypes.String
          }
        }
      )

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

      const broadcastResult = await createComment({
        profileId: profile.id,
        publicationId: params.publicationId,
        metadata
      })

      if (onSuccess) onSuccess()

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    logHours
  }
}

export default useLogHours
