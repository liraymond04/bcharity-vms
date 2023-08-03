import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { CauseMetadata, CauseMetadataVersion, MetadataVersion } from '../types'
import { getAttribute } from './getAttribute'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const allMetadata: (CauseMetadata & {
    createdAt: number
    id: string
    pub: PublicationFragment
  })[] = data
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
        version: getAttribute(attributes, 'version') as CauseMetadataVersion,
        cause_id: getAttribute(attributes, 'cause_id'),
        name: getAttribute(attributes, 'name'),
        category: getAttribute(attributes, 'category'),
        currency: getAttribute(attributes, 'currency'),
        contribution: getAttribute(attributes, 'contribution'),
        goal: getAttribute(attributes, 'goal'),
        recipient: getAttribute(attributes, 'recipient'),
        description: getAttribute(attributes, 'description'),
        location: getAttribute(attributes, 'location'),
        imageUrl: getAttribute(attributes, 'imageUrl'),
        from: post.profile,
        createdAt: new Date(post.createdAt).getTime(),
        id: post.id,
        pub: post
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
