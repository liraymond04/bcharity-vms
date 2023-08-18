import { CommentFragment, PostFragment } from '@lens-protocol/client'

import { PublicationMetadataFieldNames } from '@/lib/metadata/PublicationMetadata'

import { OpportunityMetadataVersion } from '../types'
import { InvalidMetadataException } from './InvalidMetadataException'
import {
  UpdateableMetadata,
  UpdateableMetadataBuilder
} from './UpdateableMetadata'

/**
 * The type of opportunity data used in {@link buildMetadata}
 */
export type OpportunityMetadataRecord = Record<
  Exclude<keyof OpportunityMetadata, PublicationMetadataFieldNames>,
  string
>

/**
 * A data class that represents some opportunity metadata
 */
export class OpportunityMetadata extends UpdateableMetadata {
  static MetdataVersions = Object.values(OpportunityMetadataVersion)

  /**
   * Creates an instance of OpportunityMetadata from an OpportunityMetadataBuilder.
   */
  constructor(builder: OpportunityMetadataBuilder) {
    super(builder)
    this.name = builder.name
    this.startDate = builder.startDate
    this.endDate = builder.endDate
    this.hoursPerWeek = builder.hoursPerWeek
    this.category = builder.category
    this.website = builder.website
    this.description = builder.description
    this.imageUrl = builder.imageUrl
    this.applicationRequired = builder.applicationRequired
  }

  /**
   * The opportunity name
   */
  name: string
  /**
   * The opportunity start date in YYYY-MM-DD format
   */
  startDate: string
  /**
   * The opportunity end date in YYYY-MM-DD format
   */
  endDate: string
  /**
   * The number of hours per week for this volunteer opportunity
   */
  hoursPerWeek: string
  /**
   * The category associated with the volunteer opportunity
   */
  category: string
  /**
   * An optional url to link to an external webste
   */
  website: string
  /**
   * The opportunity description
   */
  description: string
  /**
   * An optional URL to image uploaded to IPFS. Empty string if no image
   */
  imageUrl: string
  /**
   * Whether or not applications are required for this volunteer opportunity
   */
  applicationRequired: boolean
}

/**
 * Builder class for OpportunityMetadata
 */
export class OpportunityMetadataBuilder extends UpdateableMetadataBuilder<OpportunityMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(OpportunityMetadata.MetdataVersions), post)

    if (this.version === OpportunityMetadataVersion['1.0.0']) {
      super.id = this.getAttribute('opportunity_id')
      this.name = this.getAttribute('name')
      this.startDate = this.getAttribute('startDate')
      this.endDate = ''
      this.hoursPerWeek = this.getAttribute('hoursPerWeek')
      this.category = this.getAttribute('category')
      this.website = this.getAttribute('website')
      this.description = this.getAttribute('description')
      this.imageUrl = this.getAttribute('imageUrl')
    } else if (
      this.version === OpportunityMetadataVersion['1.0.1'] ||
      this.version === OpportunityMetadataVersion['1.0.2']
    ) {
      this.name = this.getAttribute('name')
      this.startDate = this.getAttribute('startDate')
      this.endDate = this.getAttribute('endDate', { default: '' })
      this.hoursPerWeek = this.getAttribute('hoursPerWeek')
      this.category = this.getAttribute('category')
      this.website = this.getAttribute('website')
      this.description = this.getAttribute('description')
      this.imageUrl = this.getAttribute('imageUrl')
    }

    if (this.version < '1.0.2') {
      this.applicationRequired = true
    } else {
      const applicationRequiredString = this.getAttribute('applicationRequired')
      if (applicationRequiredString === 'true') {
        this.applicationRequired = true
      } else if (applicationRequiredString === 'false') {
        this.applicationRequired = false
      } else {
        throw new InvalidMetadataException(
          `Value ${applicationRequiredString} is not a valid value for the boolean applicationRequired`
        )
      }
    }
  }

  buildObject(): OpportunityMetadata {
    return new OpportunityMetadata(this)
  }

  getValidationErrors() {
    return super.getValidationErrors()
  }

  readonly name: string = ''
  readonly startDate: string = ''
  readonly endDate: string = ''
  readonly hoursPerWeek: string = ''
  readonly category: string = ''
  readonly website: string = ''
  readonly description: string = ''
  readonly imageUrl: string = ''
  readonly applicationRequired: boolean = false
}
