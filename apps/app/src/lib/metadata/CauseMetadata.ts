import { CommentFragment, PostFragment } from '@lens-protocol/client'

import {
  PublicationMetadata,
  PublicationMetadataBuilder,
  PublicationMetadataFieldNames
} from '@/lib/metadata/PublicationMetadata'

import { getAttribute } from '../lens-protocol/getAttribute'
import { CauseMetadataVersion } from '../types'

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
export class CauseMetadata extends PublicationMetadata {
  static MetdataVersions = Object.values(CauseMetadataVersion)

  /**
   * Creates an instance of CauseMetadata from a CauseMetadataBuilder.
   */
  constructor(builder: CauseMetadataBuilder) {
    super(builder)
    this.cause_id = builder.cause_id
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
   * A uuid associated with this cause
   */
  cause_id: string
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
export class CauseMetadataBuilder extends PublicationMetadataBuilder<CauseMetadata> {
  constructor(post: PostFragment | CommentFragment) {
    super(new Set(CauseMetadata.MetdataVersions), post)

    this._cause_id = getAttribute(post.metadata.attributes, 'cause_id')
    this._name = getAttribute(post.metadata.attributes, 'name')
    this._category = getAttribute(post.metadata.attributes, 'category')
    this._currency = getAttribute(post.metadata.attributes, 'currency')
    this._contribution = getAttribute(post.metadata.attributes, 'contribution')
    this._goal = getAttribute(post.metadata.attributes, 'goal')
    this._recipient = getAttribute(post.metadata.attributes, 'recipient')
    this._description = getAttribute(post.metadata.attributes, 'description')
    this._location = getAttribute(post.metadata.attributes, 'location')
    this._imageUrl = getAttribute(post.metadata.attributes, 'imageUrl')
  }

  buildObject(): CauseMetadata {
    return new CauseMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  private _cause_id: string = ''
  private _name: string = ''
  private _category: string = ''
  private _currency: string = ''
  private _contribution: string = ''
  private _goal: string = ''
  private _recipient: string = ''
  private _description: string = ''
  private _imageUrl: string = ''
  private _location: string = ''

  get cause_id() {
    return this._cause_id
  }
  get name() {
    return this._name
  }
  get category() {
    return this._category
  }
  get currency() {
    return this._currency
  }
  get contribution() {
    return this._contribution
  }
  get goal() {
    return this._goal
  }
  get recipient() {
    return this._recipient
  }
  get description() {
    return this._description
  }
  get location() {
    return this._location
  }
  get imageUrl() {
    return this._imageUrl
  }
}
