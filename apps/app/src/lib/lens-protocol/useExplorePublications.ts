import {
  ExplorePublicationRequest,
  PublicationFragment
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import lensClient from './lensClient'

const useExplorePublications = (params: ExplorePublicationRequest) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment[]>([])
  const [error, setError] = useState('')

  const refetch = () => {
    setLoading(true)
    lensClient()
      .explore.publications(params)
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

export default useExplorePublications
