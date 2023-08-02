import {
  PublicationMetadata,
  PublicationMetadataBuilder
} from '@/lib/metadata/PublicationMetadata'

/**
 * A data class that represents some opportunity metadata
 */
export class OpportunityMetadata extends PublicationMetadata {
  /**
   * Creates an instance of OpportunityMetadata from an OpportunityMetadataBuilder.
   * @date 8/2/2023 - 10:49:37 AM
   *
   * @constructor
   * @param {OpportunityMetadataBuilder} builder
   */
  constructor(builder: OpportunityMetadataBuilder) {
    super(builder)
    this.opportunity_id = builder.opportunity_id
    this.name = builder.name
    this.startDate = builder.startDate
    this.endDate = builder.endDate
    this.hoursPerWeek = builder.hoursPerWeek
    this.category = builder.category
    this.website = builder.website
    this.description = builder.description
    this.imageUrl = builder.imageUrl
  }
  /**
   * A uuid associated with a volunteer opporunity
   */

  opportunity_id: string
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
}

export class OpportunityMetadataBuilder extends PublicationMetadataBuilder<OpportunityMetadata> {
  buildObject(): OpportunityMetadata {
    return new OpportunityMetadata(this)
  }

  getValidationErrors() {
    return null
  }

  private _opportunity_id: string = ''
  private _name: string = ''
  private _startDate: string = ''
  private _endDate: string = ''
  private _hoursPerWeek: string = ''
  private _category: string = ''
  private _website: string = ''
  private _description: string = ''
  private _imageUrl: string = ''

  get opportunity_id() {
    return this._opportunity_id
  }
  get name() {
    return this._name
  }
  get startDate() {
    return this._startDate
  }
  get endDate() {
    return this._endDate
  }
  get hoursPerWeek() {
    return this._hoursPerWeek
  }
  get category() {
    return this._category
  }
  get website() {
    return this._website
  }
  get description() {
    return this._description
  }
  get imageUrl() {
    return this._imageUrl
  }
}
