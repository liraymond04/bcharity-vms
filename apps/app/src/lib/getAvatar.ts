import { ProfileFragment as Profile } from '@lens-protocol/client'

const getAvatar = (profile: Profile): string => {
  return `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
}

export default getAvatar
