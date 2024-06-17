import {
  MetadataAttributeType,
  ProfileFragment,
  PublicationMetadataDisplayType,
  PublicationMetadataMainFocusType // Ensure this is the correct type or replace with the appropriate one
} from '@lens-protocol/client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'
import { LogVhrRequestMetadataRecord, PostTags } from '@/lib/metadata'

import getUserLocale from '../getUserLocale'
import { MetadataVersion } from '../types'
import checkAuth from './checkAuth'
import useCreateComment from './useCreateComment'

export interface UseLogHoursParams {
  publicationId: string
  organizationId: string
}

export interface UseLogHoursReturn {
  isLoading: boolean
  error: string
  logHours: (
    profile: ProfileFragment | null,
    hoursToVerify: string,
    comments: string,
    onSuccess?: VoidFunction
  ) => Promise<void>
}

// Define a custom type for metadata
type PublicationMetadataInput = {
  version: string
  metadata_id: string
  content: string
  locale: string
  tags: string[]
  mainContentFocus: PublicationMetadataMainFocusType
  name: string
  attributes: MetadataAttributeType[]
  appId: string
}

const useLogHours = (params: UseLogHoursParams): UseLogHoursReturn => {
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const { createComment } = useCreateComment()

  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const logHours = async (
    profile: ProfileFragment | null,
    hoursToVerify: string,
    comments: string,
    onSuccess?: VoidFunction
  ) => {
    if (profile === null) {
      setError(e('profile-null'))
      return
    }

    setIsLoading(true)
    setError('')

    const data: LogVhrRequestMetadataRecord = {
      type: PostTags.VhrRequest.Opportunity,
      version: MetadataVersion.LogVhrRequestMetadataVersions['1.0.0'],
      hoursToVerify,
      comments
    }

    const attributes: MetadataAttributeType[] = Object.entries(data).map(
      ([k, v]) => {
        return {
          traitType: k,
          value: v,
          displayType: PublicationMetadataDisplayType.String // Use the correct type for displayType
        }
      }
    )

    const metadata: PublicationMetadataInput = {
      version: '2.0.0',
      metadata_id: v4(),
      content: `#${PostTags.VhrRequest.Opportunity} #${params.organizationId}`,
      locale: getUserLocale(),
      tags: [PostTags.VhrRequest.Opportunity, params.organizationId],
      mainContentFocus: PublicationMetadataMainFocusType.TextOnly,
      name: `${PostTags.VhrRequest.Opportunity} by ${profile.handle} for publication ${params.publicationId}`,
      attributes,
      appId: APP_NAME
    }

    try {
      await checkAuth(profile.ownedBy.address)

      await createComment({
        profileId: profile.id,
        publicationId: params.publicationId,
        metadata
      })

      if (onSuccess) onSuccess()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
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
