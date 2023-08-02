import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder
} from '@/lib/metadata/PublicationMetadata'

import { getAttribute } from '../lens-protocol/getAttribute'
import { OpportunityMetadata } from './OpportunityMetadata'

/**
 * A data class that represents a VHR request
 */
export class LogVhrRequestMetadata extends PublicationMetadata {
  /**
   * Creates an instance of OpportunityMetadata from an OpportunityMetadataBuilder.
   *
   * @constructor
   * @param {LogVhrRequestMetadataBuilder} builder
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
    versions: Set<string>,
    post: PostFragment | CommentFragment,
    opportunity: OpportunityMetadata
  ) {
    super(versions, post)

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
