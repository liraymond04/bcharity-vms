import { useBalance } from 'wagmi'

import { VHR_TOKEN } from '@/constants'

export const useWalletBalance = (address: string) => {
  const { data, isLoading } = useBalance({
    address: `0x${address.substring(2)}`,
    token: `0x${VHR_TOKEN.substring(2)}`
  })

  return { data, isLoading }
}
