import { ProfileFragment } from '@lens-protocol/client'
import {
  MetadataAttributeType,
  StringAttribute,
  textOnly,
  TextOnlyMetadata
} from '@lens-protocol/metadata'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'

import getUserLocale from '../getUserLocale'

/**
 * A function to build metadata of a type
 *
 * @template T The metadata record type, e.g. {@link OpportunityMetadataRecord}
 * @param publisher The profile making the post
 * @param tags The array of PostTags for the post
 * @param data the attribute data for the post
 * @returns  metadata that can be passed into createPost()
 *
 * @example
 *
 * ```ts
 * // from PublishOpportunityModal.tsx
 * const metadata = buildMetadata<OpportunityMetadataRecord>(
 *   publisher,
 *   [PostTag.PublishOpportunity],
 *   {
 *     version: MetadataVersion.OpportunityMetadataVersion['1.0.0'],
 *     type: PostTags.OrgPublish.Opportunity,
 *     id: v4(),
 *     ...formData,
 *     imageUrl
 *   }
 * )
 *
 * try {
 *   await checkAuth(publisher.ownedBy)
 *   await createPost(publisher, metadata)
 * //...
 * ```
 *
 */
const buildMetadata = <T extends Record<string, string> = {}>(
  publisher: ProfileFragment,
  tags: string[],
  data: T
) => {
  const attributeInput: StringAttribute[] = Object.entries(data).map(
    ([k, v]) => {
      let value = '_EMPTY_VALUE'
      if (v) {
        value = v
      }
      return {
        type: MetadataAttributeType.STRING,
        key: k,
        value: value
      }
    }
  )

  let _content = ''
  let _name = ''

  tags.forEach((t) => {
    _content = _content + `#${t} `
    _name = _name + `${t} `
  })

  _name.concat(`by ${publisher.handle}`)

  const metadata: TextOnlyMetadata = textOnly({
    attributes: attributeInput,
    id: v4(),
    content: _content,
    locale: getUserLocale(),
    tags,
    appId: APP_NAME
  })

  // console.log('built metadata', metadata)

  return metadata
}

export { buildMetadata }
