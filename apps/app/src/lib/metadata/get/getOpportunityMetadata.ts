import { PublicationFragment } from '@lens-protocol/client'

import {
  InvalidMetadataException,
  isPost,
  OpportunityMetadata,
  OpportunityMetadataBuilder
} from '..'
import { getMostRecent } from './getMostRecent'

/**
 * @brief Extracts opportunity metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered opportunity post metadata, showing only the most recent posts
 *
 */
const getOpportunityMetadata = (data: PublicationFragment[]) => {
  const metadata: OpportunityMetadata[] = data
    .filter(isPost)
    .map((post) => {
      try {
        return new OpportunityMetadataBuilder(post).build()
      } catch (e) {
        console.debug(
          'warning: ignored metadata from post %o due to error %o',
          post.metadata,
          (e as unknown as InvalidMetadataException).message
        )
        return null
      }
    })
    .filter((o): o is OpportunityMetadata => o !== null)

  return getMostRecent<OpportunityMetadata>(metadata)
}

export default getOpportunityMetadata
