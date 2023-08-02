import {
  CommentFragment,
  PostFragment,
  ProfileFragment
} from '@lens-protocol/client'

import { getAttribute } from '../lens-protocol/getAttribute'
import { InvalidMetadataException } from './InvalidMetadataException'
import { PostTag } from './PostTags'

/**
 * A base class for publication metadata
 * @date 8/1/2023 - 3:50:31 PM
 *
 * @export
 * @class PublicationMetadata
 * @typedef {PublicationMetadata}
 */
export class PublicationMetadata {
  /**
   * Creates an instance of PublicationMetadata.
   * @date 8/1/2023 - 3:50:31 PM
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
 * @date 8/1/2023 - 3:50:31 PM
 *
 * @export
 * @abstract
 * @class PublicationMetadataBuilder
 * @typedef {PublicationMetadataBuilder}
 * @template T the data class to build
 */
export abstract class PublicationMetadataBuilder<T> {
  /**
   * A set of version strings
   * @date 8/1/2023 - 3:50:31 PM
   *
   * @type {Set<string>}
   */
  versions: Set<string>

  /**
   * Creates an instance of PublicationMetadataBuilder.
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @constructor
   * @param {Set<string>} versions a set of version strings that should be recognized by the builder
   * @param {(PostFragment | CommentFragment)} post the lens protocol post or comment
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
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @param {string} tagString
   * @returns {boolean}
   */
  private isPostTag(tagString: string): boolean {
    return !!Object.values(PostTag).find((t: string) => t === tagString)
  }

  /**
   * Utility function that tests if a metadata string value matches a version in the versions set
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @param {string} versionString
   *
   * @private
   * @returns {*}
   */
  private isVersion(versionString: string): any {
    return this.versions.has(versionString)
  }

  /**
   * A virtual method called in {@link _validate()} to throw any validation errors
   * created by classes that extend this class
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @private
   * @abstract
   * @returns {(InvalidMetadataException | null)}
   */
  protected abstract getValidationErrors(): InvalidMetadataException | null

  /**
   * A method to validate the outputted metadata when attempting to build the data class
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @private
   * @returns {*}
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
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @protected
   * @abstract
   * @returns {T}
   */
  protected abstract buildObject(): T

  /**
   * The bethod used to build the data class the builder builds
   * @date 8/1/2023 - 3:50:30 PM
   *
   * @returns {T}
   */
  build() {
    const exception = this._validate()

    if (exception !== null) throw exception

    return this.buildObject()
  }

  /**
   * The version string in the set versions
   * @date 8/1/2023 - 3:59:57 PM
   *
   * @readonly
   * @type {string}
   */
  readonly version: string
  /**
   * The post type, a string enum value in PostTags
   * @date 8/1/2023 - 3:59:57 PM
   *
   * @readonly
   * @type {PostTag}
   */
  readonly type: PostTag
  /**
   * The publication post id assigned by lens
   * @date 8/1/2023 - 3:59:57 PM
   *
   * @readonly
   * @type {string}
   */
  readonly metadata_id: string
  /**
   * The publication post createdAt date, from lens
   * @date 8/1/2023 - 3:59:57 PM
   *
   * @readonly
   * @type {string}
   */
  readonly createdAt: string
  /**
   * The profile that created the post, from lens
   * @date 8/1/2023 - 3:59:57 PM
   *
   * @readonly
   * @type {ProfileFragment}
   */
  readonly from: ProfileFragment
}
