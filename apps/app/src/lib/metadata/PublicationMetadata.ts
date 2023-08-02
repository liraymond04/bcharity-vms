import {
  CommentFragment,
  PostFragment,
  ProfileFragment
} from '@lens-protocol/client'

import { getAttribute } from '../lens-protocol/getAttribute'
import { InvalidMetadataException } from './InvalidMetadataException'
import { PostTag } from './PostTags'

/**
 * @type PublicationMetadataFields
 * The publication metadata fields defined, so that they can be excluded from
 * attribute input
 *
 * Does not using ts`keyof PublicationMetdata` due to buggy behavior with Exclude/Omit
 */
export type PublicationMetadataFields =
  | 'version'
  | 'type'
  | 'metadata_id'
  | 'createdAt'
  | 'profile'

/**
 * A base class for publication metadata
 */
export class PublicationMetadata {
  /**
   * Creates an instance of PublicationMetadata.
   *
   * @constructor
   * @param {PublicationMetadataBuilder<PublicationMetadata>} builder
   */
  constructor(builder: PublicationMetadataBuilder<PublicationMetadata>) {
    this.version = builder.version
    this.metadata_id = builder.metadata_id
    this.type = builder.type
    this.createdAt = builder.createdAt
    this.from = builder.from
  }

  /**
   * The metadata version of the post or comment
   */
  version: string
  /**
   * The PostTag type of the post or comment
   */
  type: PostTag
  /**
   * the publication id of the post or comment
   */
  metadata_id: string
  /**
   * The ISO6801 string of the time
   */
  createdAt: string
  /**
   * The profile that created the post
   */
  from: ProfileFragment
}

/**
 * An abstract base class for building publication metadata
 * @template T The data class to build
 */
export abstract class PublicationMetadataBuilder<
  T extends PublicationMetadata
> {
  /**
   * A set of version strings
   *
   * @type {Set<string>}
   */
  versions: Set<string>

  /**
   * Creates an instance of PublicationMetadataBuilder.
   *
   * @constructor
   * @param {Set<string>} versions
   * A set of version strings that should be recognized by the builder. Builders that
   * inherit from this class should define in it (or its corresponding data class) the
   * potential versions
   * @param {(PostFragment | CommentFragment)} post
   * The Lens Protocol post or comment. See {@link PostFragment} and {@link CommentFragment}
   */
  constructor(versions: Set<string>, post: PostFragment | CommentFragment) {
    this.versions = versions

    const typeMaybe = getAttribute(post.metadata.attributes, 'type')
    const versionMaybe = getAttribute(post.metadata.attributes, 'version')

    if (!typeMaybe) {
      throw new InvalidMetadataException(`Missing post tag`)
    }
    if (!this.isPostTag(typeMaybe)) {
      throw new InvalidMetadataException(
        `Post tag "${typeMaybe}" does not exist in PostTags`
      )
    }
    if (!versionMaybe) {
      throw new InvalidMetadataException(`Missing metadata version`)
    }
    if (!this.isVersion(versionMaybe)) {
      throw new InvalidMetadataException(
        `Metadata version ${versionMaybe} does not exist in "${versions.entries()}"`
      )
    }

    this.type = typeMaybe as PostTag
    this.version = versionMaybe
    this.metadata_id = post.id
    this.createdAt = post.createdAt
    this.from = post.profile
  }

  /**
   * Utility function that searches the PostTag enum to see if a metadata string value matches a value in the enum
   */
  private isPostTag(tagString: string): boolean {
    return !!Object.values(PostTag).find((t: string) => t === tagString)
  }

  /**
   * Utility function that tests if a metadata string value matches a version in the versions set
   */
  private isVersion(versionString: string): any {
    return this.versions.has(versionString)
  }

  /**
   * A virtual method called in {@link _validate()} to throw any validation errors
   * created by classes that extend this class
   */
  protected abstract getValidationErrors(): InvalidMetadataException | null

  /**
   * A method to validate the outputted metadata when attempting to build the data class
   *
   * @private
   */
  private _validate() {
    if (this.type === PostTag.NONE) {
      return new InvalidMetadataException(`Missing post tag`)
    }
    if (!this.version) {
      return new InvalidMetadataException(`missing version`)
    }
    if (!this.isVersion(this.version)) {
      return new InvalidMetadataException(
        `Metadata version "${
          this.version
        }" does not exist in "${this.versions.entries()}"`
      )
    }

    return this.getValidationErrors()
  }

  /**
   * An abstract method to build the outputted metadata, after validation
   */
  protected abstract buildObject(): T

  /**
   * The bethod used to build the data class
   */
  build() {
    const exception = this._validate()

    if (exception !== null) throw exception

    return this.buildObject()
  }

  /**
   * The version string in the set versions
   */
  readonly version: string
  /**
   * The post type, a string enum value in PostTags
   */
  readonly type: PostTag
  /**
   * The publication post id assigned by lens
   */
  readonly metadata_id: string
  /**
   * The publication post createdAt date, from lens
   */
  readonly createdAt: string
  /**
   * The profile that created the post, from lens
   */
  readonly from: ProfileFragment
}
