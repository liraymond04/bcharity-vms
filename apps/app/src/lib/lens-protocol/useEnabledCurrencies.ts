import { Erc20Fragment } from '@lens-protocol/client'
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
  const [data, setData] = useState<Erc20Fragment[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!address) return

    checkAuth(address)
      .then(() => lensClient().modules.fetchEnabledCurrencies())
      .then((currenciesResult) => {
        if (currenciesResult.isSuccess()) {
          setData(currenciesResult.value)
        } else {
          setError(currenciesResult.error.message)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [address])

  return { data, error }
}

export default useEnabledCurrencies
