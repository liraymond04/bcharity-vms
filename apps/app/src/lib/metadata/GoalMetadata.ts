import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { GoalMetadataVersion } from '../types'

/**
 * The types of goal metadata for form
 */

export type GoalMetadataRecord = Record<
  Exclude<keyof GoalMetadata, PublicationMetadataFieldNames>,
  string
>

/**
 * A data class that represents some goal metadata
 */
export class GoalMetadata extends PublicationMetadata {
  static MetdataVersions = Object.values(GoalMetadataVersion)

  /**
   * Creates an instance of GoalMetadata from a GoalMetadataBuilder.
   */
  constructor(builder: GoalMetadataBuilder) {
    super(builder)
    this.goal = builder.goal
    this.goalDate = builder.goalDate
  }

  /**
   * new vhr goal value set
   */
  goal: string
  /**
   * date in YYYY-MM-DD format for when goal was set
   */
  goalDate: string
}

/**
 * Builder class for GoalMetadata
 */
export class GoalMetadataBuilder extends PublicationMetadataBuilder<GoalMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(GoalMetadata.MetdataVersions), post)

    this._goal = this.getAttribute('goal')
    this._goalDate = this.getAttribute('goalDate')
  }

  buildObject(): GoalMetadata {
    return new GoalMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  private _goal: string = ''
  private _goalDate: string = ''

  get goal() {
    return this._goal
  }
  get goalDate() {
    return this._goalDate
  }
}
