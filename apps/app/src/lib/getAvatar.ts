import { ProfileFragment as Profile } from '@lens-protocol/client'

const getAvatar = (profile: Profile): string => {
  return (
    // @ts-ignore
    profile?.picture?.original?.url ??
    // @ts-ignore
    profile?.picture?.uri ??
    `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
  )
}

export default getAvatar
