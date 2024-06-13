import lensClient from './lensClient'

/**
 * Utility function to get the profiles owned by an ethereum address
 *
 * @param address The ethereum address that ownes the profiles
 * @returns A promise containing the array of {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ProfileFragment.html | Profiles}
 */
const getProfilesOwnedBy = async (address: string) => {
  const allOwnedProfiles = await lensClient().profile.fetchAll({
    where: {
      ownedBy: [address]
    }
  })

  return allOwnedProfiles.items
}

export default getProfilesOwnedBy
