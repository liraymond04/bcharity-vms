import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import {
  CauseMetadata,
  CauseMetadataBuilder,
  InvalidMetadataException,
  isPost
} from '../metadata'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const allMetadata: CauseMetadata[] = data
    .filter(isPost)
    .map((post) => {
      try {
        return new CauseMetadataBuilder(post).build()
      } catch (e) {
        console.debug(
          'warning: ignored metadata from post %o due to error %o',
          (post as PostFragment).metadata,
          (e as unknown as InvalidMetadataException).message
        )
        return null
      }
    })
    .filter((o): o is CauseMetadata => o !== null)

  const causeIdCreatedAtMap: Record<string, number> = {}

  allMetadata.forEach((val) => {
    const unixTime = new Date(val.createdAt).getTime()
    if (
      !causeIdCreatedAtMap[val.cause_id] ||
      causeIdCreatedAtMap[val.cause_id] < unixTime
    ) {
      causeIdCreatedAtMap[val.cause_id] = unixTime
    }
  })

  const updatedPosts = allMetadata.filter((post) => {
    const unixTime = new Date(post.createdAt).getTime()
    return unixTime === causeIdCreatedAtMap[post.cause_id]
  })

  return updatedPosts
}

export default getCauseMetadata
