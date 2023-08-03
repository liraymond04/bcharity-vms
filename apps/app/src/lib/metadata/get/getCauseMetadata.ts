import { PublicationFragment } from '@lens-protocol/client'

import {
  CauseMetadata,
  CauseMetadataBuilder,
  InvalidMetadataException,
  isPost
} from '..'
import { getMostRecent } from './getMostRecent'
import { logIgnoreWarning } from './logIgnoreWarning'

/**
 * Extracts cause metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered CauseMetadata[] with only the most recent posts
 *
 */
export const getCauseMetadata = (data: PublicationFragment[]) => {
  const metadata: CauseMetadata[] = data
    .filter(isPost)
    .map((post) => {
      try {
        return new CauseMetadataBuilder(post).build()
      } catch (e) {
        logIgnoreWarning(post, e as InvalidMetadataException)
        return null
      }
    })
    .filter((o): o is CauseMetadata => o !== null)

  return getMostRecent<CauseMetadata>(metadata)
}
