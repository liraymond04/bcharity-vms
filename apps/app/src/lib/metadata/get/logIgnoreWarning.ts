import { PublicationFragment } from '@lens-protocol/client'

import { InvalidMetadataException } from '../InvalidMetadataException'

export const logIgnoreWarning = (
  post: PublicationFragment,
  e: InvalidMetadataException
) => {
  console.debug(
    'warning: ignored metadata from post %s due to error %o',
    post.id,
    e.message
  )
}
