import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { CauseMetadata } from '../types'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const allMetadata: (CauseMetadata & { createdAt: number })[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length > 10 &&
        !post.hidden
    )
    .map((post) => {
      const attributes = (post as PostFragment).metadata.attributes
      return {
        cause_id: attributes[1].value ?? '',
        name: attributes[2].value ?? '',
        category: attributes[3].value ?? '',
        currency: attributes[4].value ?? '',
        contribution: attributes[5].value ?? '',
        goal: attributes[6].value ?? '',
        recipient: attributes[7].value ?? '',
        description: attributes[8].value ?? '',
        location: attributes[9].value ?? '',
        imageUrl: attributes[10].value ?? '',
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
