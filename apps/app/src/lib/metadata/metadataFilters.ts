import {
  AnyPublicationFragment,
  CommentFragment,
  MirrorFragment,
  PostFragment
} from '@lens-protocol/client'

/**
 * Typeguard for a PublicationFragment, with the advantage of type safety
 *
 * @param p Publication fragment
 * @returns whether or not the publication is a Post
 *
 * @example Test if a publication is a post
 * ```ts
 *
 * const publication: PublicationFragment = ...
 *
 * if (!isPost(publication)) {
 *   ...
 * }
 * else {
 *  // publication now has the type PostFragment, and you are free
 *  // to use properties such as post.metadata.attributes without casting
 * }
 * ```
 * @example Filter publications by post type with type safety convenience
 * ```ts
 *
 * const getOpportunityMetadata = (data: PublicationFragment[]) => {
 *   const allMetadata: OpportunityMetadata[] = data
 *     .filter(isPost)
 *     .map((post) => {
 *     // type of post is now PostFragment instead of PublicationFragment, and you
 *     // are free to use properties such as post.metadata.attributes without casting
 *   //...
 * }
 * ```
 */

export const isPost = (p: AnyPublicationFragment): p is PostFragment =>
  p.__typename === 'Post'

/**
 * {@link isPost}, but for comments
 */
export const isComment = (p: AnyPublicationFragment): p is CommentFragment =>
  p.__typename === 'Comment'
export const isMirror = (p: AnyPublicationFragment): p is MirrorFragment =>
  p.__typename === 'Mirror'
