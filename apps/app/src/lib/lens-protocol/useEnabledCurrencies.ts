import { Erc20Fragment } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import checkAuth from './checkAuth'
import lensClient from './lensClient'

const useEnabledCurrencies = (address: string | undefined) => {
  const [data, setData] = useState<Erc20Fragment[]>()
  const [error, setError] = useState<Error>()

  const fetch = async () => {
    if (!address) return

    await checkAuth(address)

    const result = await lensClient().modules.fetchEnabledCurrencies()

    return result
  }

  let run = true
  useEffect(() => {
    const getEnabledCurrencies = async () => {
      try {
        await fetch().then((result) => {
          if (result) setData(result.unwrap())
        })
      } catch (e) {
        if (e instanceof Error) {
          setError(e)
        }
      }
    }

    if (address && run) {
      getEnabledCurrencies()
      run = false
    }
  }, [address])

  return { data, error }
}

export default useEnabledCurrencies
