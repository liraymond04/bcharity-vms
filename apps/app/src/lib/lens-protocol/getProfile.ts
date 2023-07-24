import { ProfileFragment } from '@lens-protocol/client'

import lensClient from './lensClient'

interface PropsHandle {
  handle: string
}

interface PropsId {
  id: string
}

type Props = PropsHandle | PropsId

const getProfile = async (props: Props): Promise<ProfileFragment | null> => {
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
