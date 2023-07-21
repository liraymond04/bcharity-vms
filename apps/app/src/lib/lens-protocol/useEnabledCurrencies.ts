import { Erc20Fragment } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import checkAuth from './checkAuth'
import lensClient from './lensClient'

const useEnabledCurrencies = (address: string | undefined) => {
  const [data, setData] = useState<Erc20Fragment[]>()

  useEffect(() => {
    const getEnabledCurrencies = async () => {
      try {
        if (!address) return
        await checkAuth(address)
        const authenticated =
          await lensClient().authentication.isAuthenticated()
        if (authenticated) {
          const result = await lensClient().modules.fetchEnabledCurrencies()
          return result
        }
      } catch (e) {
        console.log(e)
      }
    }

    getEnabledCurrencies().then((data) => {
      if (data) setData(data.unwrap())
    })
  }, [address])

  return { data }
}

export default useEnabledCurrencies
