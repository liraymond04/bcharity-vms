import { CommentFragment, PostFragment } from '@lens-protocol/client'

import { getAttribute } from '../lens-protocol/getAttribute'
import {
  PublicationMetadata,
  PublicationMetadataBuilder
} from './PublicationMetadata'

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

export abstract class UpdateableMetadataBuilder<
  T extends UpdateableMetadata
> extends PublicationMetadataBuilder<T> {
  constructor(versions: Set<string>, post: PostFragment | CommentFragment) {
    super(versions, post)
    this.id = getAttribute(post.metadata.attributes, 'id')
  }
  readonly id: string
}
