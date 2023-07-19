import { PublicationFragment } from '@lens-protocol/client'

import { CauseMetadata } from '../types'

const getCauseMetadata = (data: PublicationFragment[]) =>
  data
    .filter(
      (post) =>
        post.__typename === 'Post' && post.metadata.attributes.length !== 0
    )
    .map((post): CauseMetadata | undefined => {
      if (post.__typename === 'Post' && post.metadata.attributes.length !== 0) {
        const attributes = post.metadata.attributes
        return {
          cause_id: attributes[1].value,
          name: attributes[2].value,
          category: attributes[3].value,
          currency: attributes[4].value,
          contribution: attributes[5].value,
          goal: attributes[6].value,
          recipient: attributes[7].value,
          description: attributes[8].value,
          from: post.profile
        }
      }
    })

export default getCauseMetadata
