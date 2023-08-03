import {
  PostFragment,
  PublicationFragment,
  PublicationTypes
} from '@lens-protocol/client'

import {
  filterMetadata,
  InvalidMetadataException,
  MetadataFilterOptions,
  OpportunityMetadata,
  OpportunityMetadataBuilder
} from '../metadata'

/**
 * @file getOpportunityMetadata.ts
 * @brief Extracts opportunity metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered opportunity post metadata, showing only the most recent posts
 *
 */
const getOpportunityMetadata = (
  data: PublicationFragment[],
  showHidden = false
) => {
  const filterOptions: MetadataFilterOptions = {
    publicationType: PublicationTypes.Post,
    showHidden
  }

  const allMetadata: OpportunityMetadata[] = filterMetadata(data, filterOptions)
    .map((post) => {
      try {
        return new OpportunityMetadataBuilder(post as PostFragment).build()
      } catch (e) {
        console.debug(
          'warning: ignored metadata from post %o due to error %o',
          (post as PostFragment).metadata,
          (e as unknown as InvalidMetadataException).message
        )
        return null
      }
    })
    .filter((o): o is OpportunityMetadata => o !== null)

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
