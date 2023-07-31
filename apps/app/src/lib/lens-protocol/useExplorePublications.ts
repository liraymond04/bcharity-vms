import {
  ExplorePublicationRequest,
  PublicationFragment
} from '@lens-protocol/client'
import {
  Maybe,
  PaginatedResultInfo,
  Scalars
} from '@lens-protocol/client/dist/declarations/src/graphql/types.generated'
import { useEffect, useState } from 'react'

import isVerified from '../isVerified'
import lensClient from './lensClient'

const useExplorePublications = (
  params: ExplorePublicationRequest,
  verified: boolean
) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment[]>([])
  const [error, setError] = useState('')
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const refetch = () => {
    setLoading(true)
    lensClient()
      .explore.publications(params)
      .then((data) => {
        const filtered = data.items.filter((item) => {
          if (!verified) return true
          return isVerified(item.profile.id)
        })
        setData(filtered)
        setPageInfo(data.pageInfo)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchMore = (cursor: Maybe<Scalars['Cursor']>) => {
    params.cursor = cursor
    lensClient()
      .explore.publications(params)
      .then((_data) => {
        const newData = data.concat(_data.items)
        setData(newData)
        setPageInfo(_data.pageInfo)
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
    pageInfo,
    refetch,
    fetchMore
  }
}

export default useExplorePublications
