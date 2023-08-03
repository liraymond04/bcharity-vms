import {
  CommentFragment,
  MirrorFragment,
  PostFragment,
  PublicationFragment
} from '@lens-protocol/client'

export const isPost = (p: PublicationFragment): p is PostFragment =>
  p.__typename === 'Post'
export const isComment = (p: PublicationFragment): p is CommentFragment =>
  p.__typename === 'Comment'
export const isMirror = (p: PublicationFragment): p is MirrorFragment =>
  p.__typename === 'Mirror'
