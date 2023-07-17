import { PublicationFragment } from '@lens-protocol/client'

import { OpportunityMetadata } from '../types'

const getOpportunityMetadata = (data: PublicationFragment[]) =>
  data
    .filter(
      (post) =>
        post.__typename === 'Post' && post.metadata.attributes.length !== 0
    )
    .map((post): OpportunityMetadata | undefined => {
      if (post.__typename === 'Post' && post.metadata.attributes.length !== 0) {
        const attributes = post.metadata.attributes
        return {
          opportunity_id: attributes[1].value,
          name: attributes[2].value,
          date: attributes[3].value,
          hours: attributes[4].value,
          category: attributes[5].value,
          website: attributes[6].value,
          description: attributes[7].value,
          from: post.profile
        }
      }
    })

export default getOpportunityMetadata
