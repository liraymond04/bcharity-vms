import {
  Erc20Fragment,
  InputMaybe,
  PaginatedResult,
  Scalars
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import checkAuth from './checkAuth'
import lensClient from './lensClient'

/**
 * React hook to fetch enabled currencies of a profile
 *
 * @param address The ethereum address of the user
 * @returns data: the enabled currency data \
 *          error: an error message if the request failed
 */
const useEnabledCurrencies = (address: string | undefined) => {
  const [data, setData] = useState<PaginatedResult<Erc20Fragment>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] =
    useState<InputMaybe<Scalars['Cursor']['input']>>(null)

  useEffect(() => {
    if (!address) return

    checkAuth(address)
      .then(() => lensClient().modules.fetchCurrencies())
      .then((data) => {
        setData(data)
        setCursor(data.pageInfo.next)
        setHasMore(data.pageInfo.next !== null)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [address])

  return {
    loading,
    data,
    error,
    hasMore
    // fetch,
    // fetchMore // add if necessary
  }
}

export default useEnabledCurrencies
