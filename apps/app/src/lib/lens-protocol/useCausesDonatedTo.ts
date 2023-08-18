import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CauseMetadata } from '../metadata'

/**
 * Returned by the {@link useCausesDonatedTo} hook
 */
export interface UseCausesDonatedToReturn {
  /**
   * The Cause and amount donated data for causes a profile has donated to
   */
  data: (CauseMetadata & { amountDonated: number })[]
  /**
   * Whether or not the data is loading
   */
  loading: boolean
  /**
   * An error message data fetch failed
   */
  error: string
  refetch: () => Promise<void>
}

/**
 * Params for the {@link useCausesDonatedTo} hook
 */
export interface UseCausesDonatedToParams {
  /**
   * The profile id of the profile to fetch data for
   */
  profileId: string | undefined
}
/**
 * React hook to get the causes a profile has donated to
 *
 * This is an incomplete development stub
 *
 * @param params Parameters for the hook
 */
const useCausesDonatedTo = ({ profileId }: UseCausesDonatedToParams) => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [data, setData] = useState<
    (CauseMetadata & { amountDonated: number })[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = async () => {
    if (profileId) {
      setError(e('profile-null'))
      return
    }

    setLoading(true)
    setError('')

    setLoading(false)
    setError('')
  }

  useEffect(() => {
    refetch()
  }, [profileId])

  return {
    data,
    loading,
    error,
    refetch
  }
}

export default useCausesDonatedTo
