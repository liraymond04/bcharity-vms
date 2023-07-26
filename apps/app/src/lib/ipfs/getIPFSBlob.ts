import storage from './storage'

/**
 *
 * @param url The ipfs://... url where the data is stored
 * @returns a url that links to the blob data that can be used as the src for <img> and similar tags (see https://developer.mozilla.org/en-US/docs/Web/API/Blob)
 *
 * @example
 * // display an IPFS image
 * const [resolvedImageUrl, setResolvedImageUrl] = useState('')

 * useEffect(() => {
 *   if (post.imageUrl) {
 *     getIPFSBlob(post.imageUrl).then((url) => setResolvedImageUrl(url))
 *   }
 * }, [post])
 *
 * return <img src={resolvedImageUrl} />
 */
const getIPFSBlob = async (url: string) => {
  const data = await storage.download(url)
  const blob = await data.blob()
  const objectURL = URL.createObjectURL(blob)
  return objectURL
}

export default getIPFSBlob
