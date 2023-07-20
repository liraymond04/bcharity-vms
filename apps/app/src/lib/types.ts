/* eslint-disable no-unused-vars */
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
  cause_id: string
  name: string
  category: string
  currency: string
  contribution: string
  goal: string
  recipient: string
  description: string
  from: ProfileFragment
}

enum OrgPublish {
  Opportuntiy = 'ORG_PUBLISH_OPPORTUNITY',
  Cause = 'ORG_PUBLISH_CAUSE'
}

export const PostTags = {
  OrgPublish
}
