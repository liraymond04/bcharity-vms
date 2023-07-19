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

export interface CauseMetadata {
  cause_id: string | null
  name: string | null
  category: string | null
  currency: string | null
  contribution: string | null
  goal: string | null
  recipient: string | null
  description: string | null
  from: ProfileFragment
}

export const PostTags = {
  OrgPublish: 'ORG_PUBLISH_OPPORTUNITY'
}
