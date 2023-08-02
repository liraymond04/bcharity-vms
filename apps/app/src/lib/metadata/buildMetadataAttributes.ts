import {
  MetadataAttributeInput,
  PublicationMetadataDisplayTypes
} from '@lens-protocol/client'

/**
 *
 *
 * @param data The metdata field type (i.e. {@link OpportunityMetadataFields}) data
 * @returns {MetadataAttributeInput[]} an array of attributes that can be used as
 * the attribute field as part of {@link PublicationMetadataV2Input}
 *
 * @example
 *
 * ```ts
 * // from PublishOpportunityModal.tsx
 * export const createPublishAttributes = (data: {
 *   id: string
 *   formData: IPublishOpportunityFormProps
 * }) => {
 *   const attributes = buildMetadataAttributes<OpportunityMetadataFields>({
 *     version: MetadataVersion.OpportunityMetadataVersion['1.0.0'],
 *     type: PostTags.OrgPublish.Opportunity,
 *     opportunity_id: data.id,
 *     name: data.formData.name,
 *     startDate: data.formData.startDate,
 *     endDate: data.formData.endDate,
 *     hoursPerWeek: data.formData.hoursPerWeek,
 *     category: data.formData.category,
 *     website: data.formData.website,
 *     description: data.formData.description,
 *     imageUrl: data.formData.imageUrl
 *   })
 *
 *   return attributes
 * }
 *
 * // ...
 *
 * const attributes = createPublishAttributes({
 *   id: v4(),
 *   formData: { ...formData, imageUrl }
 * })
 *
 * const metadata: PublicationMetadataV2Input = {
 *   version: '2.0.0',
 *   metadata_id: v4(),
 *   content: `#${PostTags.OrgPublish.Opportunity}`,
 *   locale: getUserLocale(),
 *   tags: [PostTags.OrgPublish.Opportunity],
 *   mainContentFocus: PublicationMainFocus.TextOnly,
 *   name: `${PostTags.OrgPublish.Opportunity} by ${publisher?.handle}`,
 *   attributes,
 *   appId: APP_NAME
 * }
 *
 * await checkAuth(publisher.ownedBy)
 * await createPost(
 *   publisher,
 *   metadata,
 * //...
 * ```
 *
 */
const buildMetadataAttributes = <T extends Record<string, string>>(data: T) => {
  const attributeInput: MetadataAttributeInput[] = Object.entries(data).map(
    ([k, v]) => {
      return {
        displayType: PublicationMetadataDisplayTypes.String,
        traitType: k,
        value: v
      }
    }
  )

  return attributeInput
}

export { buildMetadataAttributes }
