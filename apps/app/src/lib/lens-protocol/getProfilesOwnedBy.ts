import { ProfileFragment as Profile } from '@lens-protocol/client'

import lensClient from './lensClient'

const getProfilesOwnedBy = async (address: string): Promise<Profile[]> => {
  const allOwnedProfiles = await lensClient.profile.fetchAll({
    ownedBy: [address]
  })

  return allOwnedProfiles.items
}

export default getProfilesOwnedBy
