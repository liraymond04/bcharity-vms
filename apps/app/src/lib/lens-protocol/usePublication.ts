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

/**
 * React hook to fetch publication data by id
 *
 * Also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#fetch}
 *
 * @param params The params for the hook
 * @returns `data` - The publication data as a PublicationFragment \
 *          `loading` - Whether or not the data is ready \
 *          `error` - An error message if the request failed
 */
const usePublication = ({ publicationId }: UsePublicationParams) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PublicationFragment>()
  const [error, setError] = useState('')

  useEffect(() => {
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
  }, [publicationId])

  return {
    loading,
    data,
    error,
    fetch
  }
}

export default usePublication
