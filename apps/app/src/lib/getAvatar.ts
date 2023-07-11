import { Profile } from '@lens-protocol/react-web'

const getAvatar = (profile: Profile): string => {
  return `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
}

export default getAvatar
