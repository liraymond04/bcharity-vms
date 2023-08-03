import { PostFragment, PublicationFragment } from '@lens-protocol/client'

import {
  CauseMetadata,
  CauseMetadataBuilder,
  InvalidMetadataException,
  isPost
} from '..'
import { getMostRecent } from './getMostRecent'

const getCauseMetadata = (data: PublicationFragment[]) => {
  const metadata: CauseMetadata[] = data
    .filter(isPost)
    .map((post) => {
      try {
        return new CauseMetadataBuilder(post).build()
      } catch (e) {
        console.debug(
          'warning: ignored metadata from post %o due to error %o',
          (post as PostFragment).metadata,
          (e as unknown as InvalidMetadataException).message
        )
        return null
      }
    })
    .filter((o): o is CauseMetadata => o !== null)

  return getMostRecent<CauseMetadata>(metadata)
}

export default getCauseMetadata
