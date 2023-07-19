import { ProfileFragment } from '@lens-protocol/client'

export interface OpportunityMetadata {
  opportunity_id: string
  name: string
  date: string
  hours: string
  category: string
  website: string
  description: string
  from: ProfileFragment
}

export const PostTags = {
  OrgPublishOpp: 'ORG_PUBLISH_OPPORTUNITY'
}
