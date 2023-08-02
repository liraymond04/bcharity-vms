import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { getAttribute } from '../lens-protocol/getAttribute'
import { LogVhrRequestMetadataVersions } from '../types'
import { OpportunityMetadata } from './OpportunityMetadata'

/**
 * @type OpportunityMetadataFields
 * The types of opportunity metadata for form
 */
export type LogVhrRequestMetadataFields = Record<
  Exclude<keyof LogVhrRequestMetadata, PublicationMetadataFieldNames>,
  string
>

/**
 * A data class that represents a VHR request
 */
export class LogVhrRequestMetadata extends PublicationMetadata {
  /**
   * The metadata versions of this type of metadata
   */
  static MetadataVersions = Object.values(LogVhrRequestMetadataVersions)

  /**
   * Creates an instance of OpportunityMetadata from an OpportunityMetadataBuilder.
   */
  constructor(builder: LogVhrRequestMetadataBuilder) {
    super(builder)
    this.opportunity = builder.opportunity
    this.hoursToVerify = builder.hoursToVerify
    this.comments = builder.comments
  }

  /**
   * The opportunity that the request was sent to
   */
  opportunity: OpportunityMetadata

  /**
   * The number of VHR hours requested
   */
  hoursToVerify: string

  /**
   * A comment left by the user
   */
  comments: string
}

export class LogVhrRequestMetadataBuilder extends PublicationMetadataBuilder<LogVhrRequestMetadata> {
  constructor(
    post: PostFragment | CommentFragment,
    opportunity: OpportunityMetadata
  ) {
    super(new Set(LogVhrRequestMetadata.MetadataVersions), post)

    this._opportunity = opportunity

    this._hoursToVerify = getAttribute(
      post.metadata.attributes,
      'hoursToVerify'
    )
    this._comments = getAttribute(post.metadata.attributes, 'comments')
  }

  buildObject(): LogVhrRequestMetadata {
    return new LogVhrRequestMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  private _opportunity: OpportunityMetadata
  private _hoursToVerify: string
  private _comments: string

  get opportunity() {
    return this._opportunity
  }
  get hoursToVerify() {
    return this._hoursToVerify
  }
  get comments() {
    return this._comments
  }
}
