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
  const [error, setError] = useState('')
  const [fetched, setFetched] = useState(false)

  const refetch = () => {
    if (!fetched) {
      setLoading(true)
      setError('')
      lensClient()
        .publication.fetchAll({
          ...params,
          where: {
            ...params.where,
            from: profileId ? [profileId] : []
          }
        })
        .then((data) => {
          setData(data.items)
          setFetched(true)
        })
        .catch((error) => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    setFetched(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  return {
    loading,
    data,
    error,
    refetch
  }
}

export default usePostData
