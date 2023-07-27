import {
  PublicationFragment,
  PublicationQueryRequest
} from '@lens-protocol/client'
import { useState } from 'react'

import lensClient from './lensClient'

const usePublication = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment>()
  const [error, setError] = useState('')

  const fetch = async (params: PublicationQueryRequest) => {
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

  return {
    loading,
    data,
    error,
    fetch
  }
}

export default usePublication
