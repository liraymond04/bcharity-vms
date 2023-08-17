import lensClient from './lensClient'

interface PropsHandle {
  handle: string
}

interface PropsId {
  id: string
}

/**
 * Function to fetch a profile either with their handle or id
 *
 * Also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#fetch}
 *
 * @param props Either { handle: string } with handle being a lens handle or
 * { id: string } with id being an ethereum address
 * @returns A promise containing the {@link https://lens-protocol.github.io/lens-sdk/types/_lens_protocol_client.ProfileFragment.html | ProfileFragment}, or null if it was not found
 */
const getProfile = async (props: PropsHandle | PropsId) => {
  if ('handle' in props) {
    const profileByHandle = await lensClient().profile.fetch({
      handle: props.handle
    })
    return profileByHandle
  } else {
    const profileById = await lensClient().profile.fetch({
      profileId: props.id
    })
    return profileById
  }
}

export default getProfile
