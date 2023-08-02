import {
  MetadataAttributeInput,
  ProfileFragment,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'

import getUserLocale from '../getUserLocale'

/**
 * A function to build metadata of a type
 *
 * @template T The metadata record type, e.g. {@link OpportunityMetadataFields}
 * @param {ProfileFragment} publisher The profile making the post
 * @param {string[]} tags The array of PostTags for the post
 * @param {T} data the attribute data for the post
 * @returns {PublicationMetadataV2Input} metadata that can be passed into createPost()
 *
 * @example
 *
 * ```ts
 * // from PublishOpportunityModal.tsx
 * const metadata = buildMetadata<OpportunityMetadataFields>(
 *   publisher,
 *   [PostTag.PublishOpportunity],
 *   {
 *     version: MetadataVersion.OpportunityMetadataVersion['1.0.0'],
 *     type: PostTags.OrgPublish.Opportunity,
 *     opportunity_id: v4(),
 *     ...formData,
 *     imageUrl
 *   }
 * )
 *
 * try {
 *   await checkAuth(publisher.ownedBy)
 *
 *   await createPost(
 * //...
 * ```
 *
 */
const buildMetadata = <T extends Record<string, string>>(
  publisher: ProfileFragment,
  tags: string[],
  data: T
) => {
  const attributeInput: MetadataAttributeInput[] = Object.entries(data).map(
    ([k, v]) => {
      return {
        displayType: PublicationMetadataDisplayTypes.String,
        traitType: k,
        value: v
      }
    }
  )

  let _content = ''
  let _name = ''

  _content.concat(...tags.map((t) => `#${t} `)).trim()
  _name.concat(...tags.map((t) => `${t} `), `by ${publisher.handle}`)

  const metadata: PublicationMetadataV2Input = {
    version: '2.0.0',
    metadata_id: v4(),
    content: _content,
    locale: getUserLocale(),
    tags,
    mainContentFocus: PublicationMainFocus.TextOnly,
    name: _name,
    attributes: attributeInput,
    appId: APP_NAME
  }

  return metadata
}

export { buildMetadata }
