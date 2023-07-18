import { ProfileFragment } from '@lens-protocol/client'

export interface OpportunityMetadata {
  opportunity_id: string | null
  name: string | null
  date: string | null
  hours: string | null
  category: string | null
  website: string | null
  description: string | null
  from: ProfileFragment
}
