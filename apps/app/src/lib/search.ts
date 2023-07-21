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
