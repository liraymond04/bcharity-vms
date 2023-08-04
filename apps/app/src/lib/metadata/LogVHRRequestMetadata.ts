import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { LogVhrRequestMetadataVersions } from '../types'
import { InvalidMetadataException } from './InvalidMetadataException'
import { OpportunityMetadata } from './OpportunityMetadata'

/**
 * The type of LogVhrRequest data used in {@link buildMetadata}
 */
export type LogVhrRequestMetadataRecord = Record<
  Exclude<
    keyof LogVhrRequestMetadata,
    PublicationMetadataFieldNames | 'opportunity'
  >,
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

/**
 * Builder class for {@link LogVhrRequestMetadata}
 */
export class LogVhrRequestMetadataBuilder extends PublicationMetadataBuilder<LogVhrRequestMetadata> {
  /**
   *
   * @param post The post
   * @param opportunity The opportunity
   *
   * @throws {@link InvalidMetadataException} when an invalid version is found or when
   */
  constructor(
    post: PostFragment | CommentFragment,
    opportunity: OpportunityMetadata
  ) {
    super(new Set(LogVhrRequestMetadata.MetadataVersions), post)

    this.opportunity = opportunity

    if (this.version === LogVhrRequestMetadataVersions['1.0.0']) {
      this.hoursToVerify = this.getAttribute('hoursToVerify')
      this.comments = this.getAttribute('comments')
    } else {
      throw new InvalidMetadataException(
        `Version "${this.version}" is not a valid version`
      )
    }
  }

  buildObject(): LogVhrRequestMetadata {
    return new LogVhrRequestMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  readonly opportunity: OpportunityMetadata
  readonly hoursToVerify: string
  readonly comments: string
}
