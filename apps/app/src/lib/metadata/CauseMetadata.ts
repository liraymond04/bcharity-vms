import { CommentFragment, PostFragment } from '@lens-protocol/client'

import { PublicationMetadataFieldNames } from '@/lib/metadata/PublicationMetadata'

import { getAttribute } from '../lens-protocol/getAttribute'
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
 * Builder class for CauseMetadata
 */
export class CauseMetadataBuilder extends UpdateableMetadataBuilder<CauseMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(CauseMetadata.MetdataVersions), post)

    this.name = getAttribute(post.metadata.attributes, 'name')
    this.category = getAttribute(post.metadata.attributes, 'category')
    this.currency = getAttribute(post.metadata.attributes, 'currency')
    this.contribution = getAttribute(post.metadata.attributes, 'contribution')
    this.goal = getAttribute(post.metadata.attributes, 'goal')
    this.recipient = getAttribute(post.metadata.attributes, 'recipient')
    this.description = getAttribute(post.metadata.attributes, 'description')
    this.location = getAttribute(post.metadata.attributes, 'location')
    this.imageUrl = getAttribute(post.metadata.attributes, 'imageUrl')
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
}
