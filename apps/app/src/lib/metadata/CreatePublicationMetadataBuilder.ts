import {
  MetadataAttributeInput,
  PublicationMetadataDisplayTypes
} from '@lens-protocol/client'

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
