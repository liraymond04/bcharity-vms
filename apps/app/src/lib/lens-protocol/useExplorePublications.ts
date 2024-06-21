import {
  AnyPublicationFragment,
  ExplorePublicationRequest
} from '@lens-protocol/client'
import {
  InputMaybe,
  Scalars
} from '@lens-protocol/client/dist/declarations/src/graphql/types.generated'
import { useEffect, useState } from 'react'

import isVerified from '../isVerified'
import lensClient from './lensClient'

/**
 * React hook wrapper for {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Explore.html#publications | exploring publications}
 * with the option to filter against verified.ts
 *
 * @param params {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ExplorePublicationRequest.html | ExplorePublicationRequest}
 * @param filterVerified Whether or not to filter against data/verified.ts
 * @returns loading   - whether or not the data is loading \
 *          data      - the post data \
 *          error     - if an error occured, the error message \
 *          hasMore   - if there is more data that can be fetched with fetchMore \
 *          refetch   - function to call to refetch the data \
 *          fetchMore - function to call to fetch the next page of results and append it to data
 */
const useExplorePublications = (
  params: ExplorePublicationRequest,
  filterVerified: boolean
) => {
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnyPublicationFragment[]>([])
  const [error, setError] = useState('')
  const [cursor, setCursor] =
    useState<InputMaybe<Scalars['Cursor']['input']>>(null)

  const refetch = () => {
    setLoading(true)
    lensClient()
      .explore.publications(params)
      .then((data) => {
        const filtered = data.items.filter(
          (item) => !filterVerified || isVerified(item.by.id)
        )
        setData(filtered)
        setCursor(data.pageInfo.next)
        setHasMore(data.pageInfo.next !== null)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchMore = async () => {
    if (!hasMore) return

    const paramsWithCursor: ExplorePublicationRequest = { ...params, cursor }

    setLoading(true)

    try {
      const _data = await lensClient().explore.publications(paramsWithCursor)
      const filtered = _data.items.filter(
        (item) => !filterVerified || isVerified(item.by.id)
      )

      setData(data.concat(filtered))
      setHasMore(!!_data.pageInfo.next)
      setCursor(_data.pageInfo.next)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else if (typeof e === 'string') {
        setError(e)
      } else {
        console.log(e)
      }
    }

    setLoading(false)
  }

  useEffect(refetch, [])

  return {
    loading,
    data,
    error,
    hasMore,
    refetch,
    fetchMore
  }
}

export default useExplorePublications
