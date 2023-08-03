import { PublicationFragment } from '@lens-protocol/client'

import {
  CauseMetadata,
  CauseMetadataBuilder,
  InvalidMetadataException,
  isPost
} from '..'
import { getMostRecent } from './getMostRecent'
import { logIgnoreWarning } from './logIgnoreWarning'

const getCauseMetadata = (data: PublicationFragment[]) => {
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

export default getCauseMetadata
