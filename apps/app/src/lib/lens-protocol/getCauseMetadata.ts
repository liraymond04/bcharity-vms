import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { CauseMetadata, CauseMetadataVersion, MetadataVersion } from '../types'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const allMetadata: (CauseMetadata & { createdAt: number })[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length > 1 &&
        post.metadata.attributes[1]?.value ===
          MetadataVersion.CauseMetadataVersion['1.0.0'] &&
        !post.hidden
    )
    .map((post) => {
      const attributes = (post as PostFragment).metadata.attributes
      return {
        version: attributes[1].value! as CauseMetadataVersion,
        cause_id: attributes[2].value ?? '',
        name: attributes[3].value ?? '',
        category: attributes[4].value ?? '',
        currency: attributes[5].value ?? '',
        contribution: attributes[6].value ?? '',
        goal: attributes[7].value ?? '',
        recipient: attributes[8].value ?? '',
        description: attributes[9].value ?? '',
        location: attributes[10].value ?? '',
        imageUrl: attributes[11].value ?? '',
        from: post.profile,
        createdAt: new Date(post.createdAt).getTime()
      }
    })

  const causeIdCreatedAtMap: Record<string, number> = {}

  allMetadata.forEach((val) => {
    if (
      !causeIdCreatedAtMap[val.cause_id] ||
      causeIdCreatedAtMap[val.cause_id] < val.createdAt
    ) {
      causeIdCreatedAtMap[val.cause_id] = val.createdAt
    }
  })

  const updatedPosts = allMetadata
    .filter((post) => {
      return post.createdAt === causeIdCreatedAtMap[post.cause_id]
    })
    .map((post) => {
      const { createdAt, ...rest } = post
      return rest
    })

  return updatedPosts
}

export default getCauseMetadata
