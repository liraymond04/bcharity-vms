import { CommentFragment, PostFragment } from '@lens-protocol/client'

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
  /**
   *
   * @param versions Metadata versions
   * @param post The post
   *
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
}
