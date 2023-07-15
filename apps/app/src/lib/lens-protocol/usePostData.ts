import { PublicationsQueryRequest } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import lensClient from './lensClient'

const usePostData = <T>(params: PublicationsQueryRequest) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState('')

  const refetch = () => {
    setLoading(true)
    lensClient()
      .publication.fetchAll(params)
      .then((data) => {
        const d: T[] = data.items.map((p: any) => p.metadata)
        setData(d)
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
