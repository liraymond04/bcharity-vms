import { CommentFragment, PostFragment } from '@lens-protocol/client'

import { PublicationMetadataFieldNames } from '@/lib/metadata/PublicationMetadata'

import { CauseMetadataVersion } from '../types'
import {
  UpdateableMetadata,
  UpdateableMetadataBuilder
} from './UpdateableMetadata'

/**
 * The types of opportunity metadata for form
 */

export type CauseMetadataRecord = Record<
  Exclude<keyof CauseMetadata, PublicationMetadataFieldNames>,
  string
>

/**
 * A data class that represents some cause metadata
 */
export class CauseMetadata extends UpdateableMetadata {
  static MetdataVersions = Object.values(CauseMetadataVersion)

  /**
   * Creates an instance of CauseMetadata from a CauseMetadataBuilder.
   */
  constructor(builder: CauseMetadataBuilder) {
    super(builder)
    this.name = builder.name
    this.category = builder.category
    this.currency = builder.currency
    this.contribution = builder.contribution
    this.goal = builder.goal
    this.recipient = builder.recipient
    this.description = builder.description
    this.imageUrl = builder.imageUrl
    this.location = builder.location
  }
  /**
   * The cause name
   */
  name: string
  /**
   * The category associated with the cause
   */
  category: string
  /**
   * TODO
   */
  currency: string
  /**
   * TODO
   */
  contribution: string
  /**
   * TODO
   */
  goal: string
  /**
   * TODO
   */
  recipient: string
  /**
   * description for this fundraiser
   */
  description: string
  /**
   * An optional URL to image uploaded to IPFS. Empty string if no image
   */
  imageUrl: string
  /**
   * The cause location in the form <City>-<State>-<Country>
   */
  location: string
}

/**
 * Builder class for {@link CauseMetadata}
 */
export class CauseMetadataBuilder extends UpdateableMetadataBuilder<CauseMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(CauseMetadata.MetdataVersions), post)

    if (this.version === CauseMetadataVersion['1.0.0']) {
      this.id = this.getAttribute('cause_id')
      this.name = this.getAttribute('name')
      this.category = this.getAttribute('category')
      this.currency = this.getAttribute('currency')
      this.contribution = this.getAttribute('contribution')
      this.goal = this.getAttribute('goal')
      this.recipient = this.getAttribute('recipient')
      this.description = this.getAttribute('description')
      this.location = this.getAttribute('location')
      this.imageUrl = this.getAttribute('imageUrl')
    } else if (this.version === CauseMetadataVersion['1.0.1']) {
      this.name = this.getAttribute('name')
      this.category = this.getAttribute('category')
      this.currency = this.getAttribute('currency')
      this.contribution = this.getAttribute('contribution')
      this.goal = this.getAttribute('goal')
      this.recipient = this.getAttribute('recipient')
      this.description = this.getAttribute('description')
      this.location = this.getAttribute('location')
      this.imageUrl = this.getAttribute('imageUrl')
    }
  }

  buildObject(): CauseMetadata {
    return new CauseMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  readonly name: string = ''
  readonly category: string = ''
  readonly currency: string = ''
  readonly contribution: string = ''
  readonly goal: string = ''
  readonly recipient: string = ''
  readonly description: string = ''
  readonly imageUrl: string = ''
  readonly location: string = ''
  readonly id: string = ''
}
