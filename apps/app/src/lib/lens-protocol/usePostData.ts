import {
  PublicationFragment,
  PublicationsQueryRequest
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
const usePostData = (params: PublicationsQueryRequest) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment[]>([])
  const [error, setError] = useState('')

  const refetch = () => {
    setLoading(true)
    setError('')
    lensClient()
      .publication.fetchAll(params)
      .then((data) => {
        setData(data.items)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(refetch, [])

  return {
    loading,
    data,
    error,
    refetch
  }
}

export default usePostData
