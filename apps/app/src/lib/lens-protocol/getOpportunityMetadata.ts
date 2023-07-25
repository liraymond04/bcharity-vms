import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import {
  MetadataVersion,
  OpportunityMetadata,
  OpportunityMetadataVersion
} from '../types'

/**
 * @file getOpportunityMetadata.ts
 * @brief Extracts opportunity metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered opportunity post metadata, showing only the most recent posts
 *
 */
const getOpportunityMetadata = (data: PublicationFragment[]) => {
  const allMetadata: (OpportunityMetadata & { createdAt: number })[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length > 1 &&
        post.metadata.attributes[1]?.value ===
          MetadataVersion.OpportunityMetadataVersion['1.0.0'] &&
        !post.hidden
    )
    .map((post) => {
      console.log(post)
      const attributes = (post as PostFragment).metadata.attributes
      return {
        version: attributes[1].value! as OpportunityMetadataVersion,
        opportunity_id: attributes[2].value ?? '',
        name: attributes[3].value ?? '',
        startDate: attributes[4].value ?? '',
        endDate: attributes[4].value ?? '',
        hoursPerWeek: attributes[5].value ?? '',
        category: attributes[6].value ?? '',
        website: attributes[7].value ?? '',
        description: attributes[8].value ?? '',
        imageUrl: attributes[9].value ?? '',
        from: post.profile,
        createdAt: new Date(post.createdAt).getTime()
      }
    })

  const opportunityIdCreatedAtMap: Record<string, number> = {}

  allMetadata.forEach((val) => {
    if (
      !opportunityIdCreatedAtMap[val.opportunity_id] ||
      opportunityIdCreatedAtMap[val.opportunity_id] < val.createdAt
    ) {
      opportunityIdCreatedAtMap[val.opportunity_id] = val.createdAt
    }
  })

  const updatedPosts = allMetadata
    .filter((post) => {
      return post.createdAt === opportunityIdCreatedAtMap[post.opportunity_id]
    })
    .map((post) => {
      const { createdAt, ...rest } = post
      return rest
    })

  return updatedPosts
}

export default getOpportunityMetadata
