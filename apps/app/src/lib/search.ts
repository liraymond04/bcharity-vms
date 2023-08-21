/**
 * Function used in filtering for fuzzy search
 * @param searched string of the original item being compared to
 * @param searchInput string of the user's search input
 * @returns if the search input matches the searched item
 *
 * @example testSearch used for fuzzy searching cause posts
 * ```tsx
 * <GridLayout>
 *   {posts
 *     .filter(
 *       (post) =>
 *         testSearch(post.name, searchValue) &&
 *         (selectedCategory === '' || post.category === selectedCategory)
 *     )
 *     .map((post) => (
 *       <GridItemFour key={post.id}>
 *         <CauseCard cause={post} />
 *       </GridItemFour>
 *     ))}
 * </GridLayout>
 * ```
 */
const testSearch = (searched: string, searchInput: string) => {
  const nameArr = searched.toLowerCase().split(' ')
  const searchArr = searchInput.toLowerCase().split(' ')
  let result = true

  searchArr.forEach((search) => {
    let found = false
    nameArr.forEach((name) => {
      let p0 = 0
      let p1 = 0
      while (p0 < name.length && p1 < search.length) {
        if (name.charAt(p0) == search.charAt(p1)) {
          p1++
        }
        p0++
      }
      if (p1 == search.length) {
        found = true
      }
    })
    if (!found) {
      result = false
    }
  })

  return result
}

export default testSearch
