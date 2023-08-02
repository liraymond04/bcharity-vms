import { MetadataAttributeOutputFragment } from '@lens-protocol/client'

export const getAttribute = <T extends Record<string, string>>(
  attributes: MetadataAttributeOutputFragment[],
  attributeName: string
) => {
  const item =
    attributes &&
    attributes.filter((item) => item.traitType === attributeName).at(0)
  if (item && item.value) {
    return item.value
  }
  return ''
}
