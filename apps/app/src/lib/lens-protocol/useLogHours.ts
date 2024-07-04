import { ProfileFragment } from '@lens-protocol/client'
import {
  MarketplaceMetadataAttribute,
  MarketplaceMetadataAttributeDisplayType,
  textOnly,
  TextOnlyMetadata
} from '@lens-protocol/metadata'
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
  /**
   * The id of the publication that created the request
   */
  publicationId: string
  /**
   * The organization that published this opportunity
   */
  organizationId: string
}

export interface UseLogHoursReturn {
  /**
   * Whether or not the request to log hours is pending
   */
  isLoading: boolean
  /**
   * An error message if the log hours failed
   */
  error: string
  /**
   *
   * @param profile The profile of the user trying to log hours
   * @param hoursToVerify The number of hours to log
   * @param comments Any comments
   * @param onSuccess Callback function to be trigged on succes
   * @returns
   */
  logHours: (
    profile: ProfileFragment | null,
    hoursToVerify: string,
    comments: string,
    onSuccess?: VoidFunction
  ) => Promise<void>
}

/**
 * A react hook to handle making VHR log requests with a comment
 *
 * @param params The params for the requests
 * @returns
 * @example A log hours button
 * // Adapted from LogHoursButton.tsx
 * ```
 * const { error, isLoading, logHours } = useLogHours({
 *   publicationId,
 *   organizationId
 * })
 * // ...
 * const onSubmit = async (formData: IVhrVerificationFormProps) => {
 *   await logHours(
 *     currentUser,
 *     formData.hoursToVerify,
 *     formData.comments,
 *     onCancel
 *   )
 * }
 */
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

    const attributes: MarketplaceMetadataAttribute[] = Object.entries(data).map(
      ([k, v]) => {
        return {
          traitType: k,
          value: v,
          displayType: MarketplaceMetadataAttributeDisplayType.STRING
        }
      }
    )

    const metadata: TextOnlyMetadata = textOnly({
      marketplace: {
        name: `${PostTags.VhrRequest.Opportunity} by ${profile.handle} for publication ${params.publicationId}`,
        attributes
      },
      id: v4(),
      content: `#${PostTags.VhrRequest.Opportunity} #${params.organizationId}`,
      locale: getUserLocale(),
      tags: [PostTags.VhrRequest.Opportunity, params.organizationId],
      appId: APP_NAME
    })

    try {
      await checkAuth(profile.ownedBy.address, profile.id)

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
