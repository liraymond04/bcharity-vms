import {
  PublicationFragment,
  PublicationQueryRequest
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import lensClient from './lensClient'

const usePublication = (params: PublicationQueryRequest) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment>()
  const [error, setError] = useState('')

  const refetch = () => {
    setLoading(true)
    lensClient()
      .publication.fetch(params)
      .then((data) => {
        if (data) setData(data)
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

export default usePublication
