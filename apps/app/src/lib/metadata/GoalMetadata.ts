import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { getAttribute } from '../lens-protocol/getAttribute'
import { GoalMetadataVersion } from '../types'

/**
 * The types of opportunity metadata for form
 */

export type GoalMetadataRecord = Record<
  Exclude<keyof GoalMetadata, PublicationMetadataFieldNames>,
  string
>

/**
 * A data class that represents some cause metadata
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
   * The cause name
   */
  goalDate: string
}

/**
 * Builder class for CauseMetadata
 */
export class GoalMetadataBuilder extends PublicationMetadataBuilder<GoalMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(GoalMetadata.MetdataVersions), post)

    this._goal = getAttribute(post.metadata.attributes, 'goal')
    this._goalDate = getAttribute(post.metadata.attributes, 'goalDate')
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
