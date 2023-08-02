import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { CauseMetadata, CauseMetadataBuilder } from '../metadata'
import { MetadataVersion } from '../types'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const allMetadata: CauseMetadata[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length > 1 &&
        post.metadata.attributes[1]?.value ===
          MetadataVersion.CauseMetadataVersion['1.0.0'] &&
        !post.hidden
    )

    .map((post) => {
      const builder = new CauseMetadataBuilder(post as PostFragment)
      return builder.build()
    })

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
