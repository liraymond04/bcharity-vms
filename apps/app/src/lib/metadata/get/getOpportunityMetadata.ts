import { PublicationFragment } from '@lens-protocol/client'

import {
  InvalidMetadataException,
  isPost,
  OpportunityMetadata,
  OpportunityMetadataBuilder
} from '..'
import { getMostRecent } from './getMostRecent'
import { logIgnoreWarning } from './logIgnoreWarning'

/**
 * Extracts opportunity metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered OpportunityMetadata[] with only the most recent posts
 *
 */
export const getOpportunityMetadata = (data: PublicationFragment[]) => {
  const metadata: OpportunityMetadata[] = data
    .filter(isPost)
    .map((post) => {
      try {
        return new OpportunityMetadataBuilder(post).build()
      } catch (e) {
        logIgnoreWarning(post, e as InvalidMetadataException)
        return null
      }
    })
    .filter((o): o is OpportunityMetadata => o !== null)

  return getMostRecent<OpportunityMetadata>(metadata)
}
