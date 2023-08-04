import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { ApplicationMetadataVersion } from '../types'
import { InvalidMetadataException } from './InvalidMetadataException'
import { OpportunityMetadata } from './OpportunityMetadata'

/**
 * The type for Application data
 */
export type ApplicationMetadataRecord = Record<
  Exclude<
    keyof ApplicationMetadata,
    PublicationMetadataFieldNames | 'opportunity'
  >,
  string
>

/**
 * A data class that represents an opportunity application
 */
export class ApplicationMetadata extends PublicationMetadata {
  /**
   * The metadata versions of this type of metadata
   */
  static MetadataVersions = Object.values(ApplicationMetadataVersion)

  /**
   * Creates an instance of OpportunityMetadata from an ApplicationMetadataBuilder.
   */
  constructor(builder: ApplicationMetadataBuilder) {
    super(builder)
    this.opportunity = builder.opportunity
    this.description = builder.description
    this.resume = builder.resume
    this.manual = builder.manual
  }

  /**
   * The opportunity that the request was sent to
   */
  opportunity: OpportunityMetadata

  /**
   * A description for the application
   */
  description: string

  /**
   * A resume for the application
   */
  resume: string

  /**
   * Whether or not the manual was made by the organization
   */
  manual: string
}

/**
 * Builder class for {@link ApplicationMetadata}
 */
export class ApplicationMetadataBuilder extends PublicationMetadataBuilder<ApplicationMetadata> {
  /**
   *
   * @param post The post
   * @param opportunity The opportunity
   *
   * @throws {@link InvalidMetadataException} when the metadata is invalid
   */
  constructor(
    post: PostFragment | CommentFragment,
    opportunity: OpportunityMetadata
  ) {
    super(new Set(ApplicationMetadata.MetadataVersions), post)

    this.opportunity = opportunity

    if (this.version === ApplicationMetadataVersion['1.0.0']) {
      this.description = this.getAttribute('description')
      this.resume = this.getAttribute('resume')
      const manual = this.getAttribute('manual')

      if (manual !== 'true' && manual !== 'false') {
        throw new InvalidMetadataException(
          `Value "${manual}" is not a valid value for "manual"`
        )
      }

      this.manual = manual
    } else {
      throw new InvalidMetadataException(
        `Version "${this.version}" is not a valid version`
      )
    }
  }

  buildObject(): ApplicationMetadata {
    return new ApplicationMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  readonly opportunity: OpportunityMetadata
  readonly manual: string
  readonly description: string
  readonly resume: string
}
