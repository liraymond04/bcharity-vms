import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { OpportunityMetadata, OpportunityMetadataBuilder } from '../metadata'
import { MetadataVersion } from '../types'
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
  const allMetadata: OpportunityMetadata[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length > 1 &&
        post.metadata.attributes[1]?.value ===
          MetadataVersion.OpportunityMetadataVersion['1.0.0'] &&
        !post.hidden
    )
    .map((post) => {
      const builder = new OpportunityMetadataBuilder(
        new Set(['1.0.0']),
        post as PostFragment
      )
      const metadata = builder.build()
      return metadata
    })

  const opportunityIdCreatedAtMap: Record<string, number> = {}

  allMetadata.forEach((val) => {
    const unixTime = new Date(val.createdAt).getTime()
    if (
      !opportunityIdCreatedAtMap[val.opportunity_id] ||
      opportunityIdCreatedAtMap[val.opportunity_id] < unixTime
    ) {
      opportunityIdCreatedAtMap[val.opportunity_id] = unixTime
    }
  })

  const updatedPosts = allMetadata.filter((post) => {
    const unixTime = new Date(post.createdAt).getTime()
    return unixTime === opportunityIdCreatedAtMap[post.opportunity_id]
  })

  return updatedPosts
}

export default getOpportunityMetadata
