import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import { OpportunityMetadata } from '../types'

const getOpportunityMetadata = (data: PublicationFragment[]) => {
  const allMetadata: (OpportunityMetadata & { createdAt: number })[] = data
    .filter(
      (post) =>
        post.__typename === 'Post' &&
        post.metadata.attributes.length !== 0 &&
        !post.hidden
    )
    .map((post) => {
      const attributes = (post as PostFragment).metadata.attributes
      return {
        opportunity_id: attributes[1].value ?? '',
        name: attributes[2].value ?? '',
        date: attributes[3].value ?? '',
        hours: attributes[4].value ?? '',
        category: attributes[5].value ?? '',
        website: attributes[6].value ?? '',
        description: attributes[7].value ?? '',
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
