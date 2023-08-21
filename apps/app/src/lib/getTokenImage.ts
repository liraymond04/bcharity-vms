import { STATIC_ASSETS } from 'src/constants'

/**
 * Helper function to get a formatted static assets URL for provided token
 * @param symbol string of the token symbol to get the URL of
 * @returns the formatted static assets URL for provided token
 */
const getTokenImage = (symbol: string): string =>
  `${STATIC_ASSETS}/tokens/${symbol?.toLowerCase()}.svg`

export default getTokenImage
