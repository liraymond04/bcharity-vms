import {
  AnyPublicationFragment,
  PublicationsRequest
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import lensClient from './lensClient'

/**
 * React hook to query lens posts associated with a profile
 * @param params `PublicationQueryRequest` data (see {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.PublicationsQueryRequest.html})
 *
 * @returns `loading`: whether or not the data is loading, \
 *          `data`: the raw post data \
 *          `error`: error message (if request fails), \
 *          `refetch`: function that triggers the data to refetch
 *
 * @example Get posts made by a profile, filtered by posts that have the tag PostTags.OrgPublish.Cause
 * ```ts
 * const { data, error, loading, refetch } = usePostData({
 * profileId: profile?.id,
 *   metadata: {
 *     tags: { all: [PostTags.OrgPublish.Cause] }
 *   }
 * })
 * ```
 */
const usePostData = (
  profileId: string | undefined,
  params: PublicationsRequest
) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnyPublicationFragment[]>([])
  const [error, setError] = useState<string | null>(null) // Updated to string or null

  const refetch = async () => {
    setLoading(true)
    setError(null) // Updated to null
    try {
      const response = await lensClient().publication.fetchAll({
        ...params,
        where: {
          ...params.where,
          from: profileId ? [profileId] : []
        }
      })
      setData(response.items)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // refetch()
  }, [profileId, params])

  return {
    loading,
    data,
    error,
    refetch
  }
}

export default usePostData
