/**
 * Utility function to get the avatar of a profile
 *
 * @param profile the profile to get the avatar of
 * @returns a link to the avatar image
 */
const getAvatar = (profile: any): string => {
  return (
    profile?.metadata?.picture?.optimized?.uri ||
    profile?.metadata?.picture?.raw?.uri ||
    profile?.metadata?.picture?.thumbnail?.url ||
    `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
  )
}

export default getAvatar
