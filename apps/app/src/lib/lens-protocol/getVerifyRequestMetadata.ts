import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { getAttribute } from './getAttribute'

const getVerifyMetadata = (data: PublicationFragment[]) => {
  return data.map((post) => {
    const attributes = (post as PostFragment).metadata.attributes
    return {
      hoursToVerify: getAttribute(attributes, 'hoursToVerify'),
      comments: getAttribute(attributes, 'comments'),
      createdAt: post.createdAt,
      id: post.id,
      from: post.profile
    }
  })
}

export default getVerifyMetadata
