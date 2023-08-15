import { ProfileFragment as Profile } from '@lens-protocol/client'

import lensClient from './lensClient'

/**
 * Utility function to get the profiles owned by an ethereum address
 *
 * @param address The ethereum address that ownes the profiles
 * @returns A promise to the addresses
 */
const getProfilesOwnedBy = async (address: string): Promise<Profile[]> => {
  const allOwnedProfiles = await lensClient().profile.fetchAll({
    ownedBy: [address]
  })

  return allOwnedProfiles.items
}

export default getProfilesOwnedBy
