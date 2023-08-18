/**
 * Helper function to check if a provided file is a valid image type by its extension
 * @param url string of the file URL
 * @returns true if the provided file is a valid image type by its extension
 */
const validImageExtension = (url: string) => {
  let imageExtentions = ['.jpeg', '.jpg', '.png', '.gif', '.svg']
  let ok = false
  imageExtentions.forEach((value) => {
    if (
      url.substring(url.length - value.length, url.length).toLowerCase() ==
      value
    )
      ok = true
  })
  return ok
}

export default validImageExtension
