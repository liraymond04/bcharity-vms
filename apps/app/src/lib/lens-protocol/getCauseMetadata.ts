import {
  PostFragment,
  PublicationFragment,
  PublicationTypes
} from '@lens-protocol/client'

import {
  CauseMetadata,
  CauseMetadataBuilder,
  filterMetadata,
  InvalidMetadataException,
  MetadataFilterOptions
} from '../metadata'

const getCauseMetadata = (data: PublicationFragment[], showHidden = false) => {
  const filterOptions: MetadataFilterOptions = {
    publicationType: PublicationTypes.Post,
    showHidden
  }

  const allMetadata: CauseMetadata[] = filterMetadata(data, filterOptions)
    .map((post) => {
      try {
        return new CauseMetadataBuilder(post as PostFragment).build()
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

  const causeIdCreatedAtMap: Record<string, number> = {}

  allMetadata.forEach((val) => {
    const unixTime = new Date(val.createdAt).getTime()
    if (
      !causeIdCreatedAtMap[val.cause_id] ||
      causeIdCreatedAtMap[val.cause_id] < unixTime
    ) {
      causeIdCreatedAtMap[val.cause_id] = unixTime
    }
  })

  const updatedPosts = allMetadata.filter((post) => {
    const unixTime = new Date(post.createdAt).getTime()
    return unixTime === causeIdCreatedAtMap[post.cause_id]
  })

  return updatedPosts
}

export default getCauseMetadata
