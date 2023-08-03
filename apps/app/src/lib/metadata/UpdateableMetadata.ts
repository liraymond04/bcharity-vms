import { CommentFragment, PostFragment } from '@lens-protocol/client'

import { InvalidMetadataException } from './InvalidMetadataException'
import {
  PublicationMetadata,
  PublicationMetadataBuilder
} from './PublicationMetadata'

/**
 * A base class for metadata with an id that can be updated by making publications
 * with an attribute that includes this id. See {getMostRecent}
 */
export class UpdateableMetadata extends PublicationMetadata {
  constructor(builder: UpdateableMetadataBuilder<UpdateableMetadata>) {
    super(builder)
    this.id = builder.id
  }

  /**
   * A uuid associated with this metadata
   */
  id: string
}

/**
 * An abstract base class to build {@link UpdateableMetadata}. Attaches
 * the id member
 */
export abstract class UpdateableMetadataBuilder<
  T extends UpdateableMetadata
> extends PublicationMetadataBuilder<T> {
  /**
   *
   * Attempts to set id field
   * TODO add note about old versions and id
   */
  constructor(versions: Set<string>, post: PostFragment | CommentFragment) {
    super(versions, post)

    try {
      this.id = this.getAttribute('id')
    } catch (e) {
      this.id = ''
    }
  }

  id: string

  protected getValidationErrors(): InvalidMetadataException | null {
    if (!this.id) return new InvalidMetadataException('id not set')
    return null
  }
}
