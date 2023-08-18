import { IS_MAINNET } from 'src/constants'

/**
 * Helper function to get a formatted Uniswap URL for the given amount and currency
 * @param amount number of the amount of currency to swap
 * @param outputCurrency string of the type of currency to swap
 * @returns formatted Uniswap URL for the given amount and currency
 */
const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

export default getUniswapURL
