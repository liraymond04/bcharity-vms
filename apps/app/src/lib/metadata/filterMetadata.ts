import { PublicationFragment, PublicationTypes } from '@lens-protocol/client'

import { PublicationMetadataBuilder } from '.'
/**
 * brief Extracts opportunity metadata from lens posts, showing only the most recent posts
 *
 * @param `data` post data (usually returned by the data part of the hook `usePostData()`)
 *
 * @returns filtered opportunity post metadata, showing only the most recent posts
 *
 */

export interface MetadataFilterOptions {
  showHidden: boolean
  publicationType: PublicationTypes
  excludeOutdated?: { idField: string }
}

const filterMetadata = <T extends typeof PublicationMetadataBuilder>(
  data: PublicationFragment[],
  options: MetadataFilterOptions
) => {
  let allMetadata = data.filter((post) => {
    return (
      post.__typename.toLowerCase() === options.publicationType.toLowerCase()
    )
  })

  if (!options.showHidden) {
    allMetadata = allMetadata.filter((post) => !post.hidden)
  }

  return allMetadata
}

export default filterMetadata
