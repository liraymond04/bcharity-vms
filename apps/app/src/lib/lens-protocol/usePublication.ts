import { PublicationFragment } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import lensClient from './lensClient'

export interface UsePublicationParams {
  /**
   * The id of the publication, or undefined. If undefined, the hook will
   * not run and the returned data will remain as undefined
   */
  publicationId?: string
}

export interface UsePublicationReturn {
  /**
   * The {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.PublicationFragment.html | PublicationFragment} data
   * associated with the publication, or undefined if the data is not ready
   */
  data: PublicationFragment | undefined
  /**
   * Whether or not the data is loading
   */
  loading: boolean
  /**
   * The error message if there was an error fetching the data
   */
  error: string
  /**
   * A function to trigger a refetch of the data
   */
  refetch: VoidFunction
}

/**
 * React hook to fetch publication data by id
 *
 * Also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#fetch}
 *
 * @param params The params for the hook
 */
const usePublication = ({
  publicationId
}: UsePublicationParams): UsePublicationReturn => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PublicationFragment>()
  const [error, setError] = useState('')

  const refetch = () => {
    if (!publicationId) return

    setLoading(true)
    lensClient()
      .publication.fetch({ publicationId })
      .then((data) => {
        if (data) setData(data)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    refetch()
  }, [publicationId])

  return {
    loading,
    data,
    error,
    refetch
  }
}

export default usePublication
