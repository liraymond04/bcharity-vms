import { UpdateableMetadata } from '..'

/**
 *
 * @param data Metadata that inherits from {@link UpdateableMetadata}
 * @returns T[], only the most recent posts
 */
export const getMostRecent = <T extends UpdateableMetadata>(data: T[]) => {
  const idTimeMap: Record<string, number> = {}

  data.forEach((val) => {
    const unixTime = new Date(val.createdAt).getTime()
    if (!idTimeMap[val.id] || idTimeMap[val.id] < unixTime) {
      idTimeMap[val.id] = unixTime
    }
  })

  const updatedPosts = data.filter((post) => {
    const unixTime = new Date(post.createdAt).getTime()
    return unixTime === idTimeMap[post.id]
  })

  return updatedPosts
}
