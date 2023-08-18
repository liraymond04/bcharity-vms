import { mainnetVerified, testnetVerified } from 'data/verified'
import { IS_MAINNET } from 'src/constants'

/**
 * Helper function to get whether the provided user is a verified organization
 * @param id string of the profile's ID
 * @returns true if the provided user is a verified organization
 */
const isVerified = (id: string): boolean =>
  IS_MAINNET ? mainnetVerified.includes(id) : testnetVerified.includes(id)

export default isVerified
