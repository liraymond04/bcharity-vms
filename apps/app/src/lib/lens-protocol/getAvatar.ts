import { ProfileFragment } from '@lens-protocol/client'

/**
 * Utility function to get the avatar of a profile
 *
 * @param profile the profile to get the avatar of
 * @returns a link to the avatar image
 */
const getAvatar = (profile: ProfileFragment): string => {
  return (
    // @ts-ignore
    profile?.picture?.original?.url ??
    // @ts-ignore
    profile?.picture?.uri ??
    `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
  )
}

export default getAvatar
