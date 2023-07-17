import { PublicationFragment } from '@lens-protocol/client'

const getOpportunityMetadata = (data: PublicationFragment[]) =>
  data
    .filter(
      (post) =>
        post.__typename === 'Post' && post.metadata.attributes.length !== 0
    )
    .map((post) => {
      if (post.__typename === 'Post' && post.metadata.attributes.length !== 0) {
        const attributes = post.metadata.attributes
        return {
          opportunity_id: attributes[1].value,
          name: attributes[2].value,
          date: attributes[3].value,
          hours: attributes[4].value,
          program: attributes[5].value,
          region: attributes[6].value,
          category: attributes[7].value,
          website: attributes[8].value,
          description: attributes[9].value
        }
      }
    })

export default getOpportunityMetadata
