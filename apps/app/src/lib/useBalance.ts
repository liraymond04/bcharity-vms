import { GetBalanceReturnType } from '@wagmi/core'
import { useBalance } from 'wagmi'

import { VHR_TOKEN } from '@/constants'

/**
 * Return type of {@link useWalletBalance}
 */
export interface WalletBalanceReturn {
  /**
   * Balance result and token information
   */
  data: GetBalanceReturnType | undefined
  /**
   * True if the balance result is being fetched
   */
  isLoading: boolean
}

/**
 * Custom hook that wraps wagmi's useBalance hook to get the balance of a provided token from an address
 * @param address string of the wallet address
 * @returns WalletBalanceReturn
 */
export const useWalletBalance = (address: string): WalletBalanceReturn => {
  const { data, isLoading } = useBalance({
    address: `0x${address.substring(2)}`,
    token: `0x${VHR_TOKEN.substring(2)}`
  })

  return { data, isLoading }
}
