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
