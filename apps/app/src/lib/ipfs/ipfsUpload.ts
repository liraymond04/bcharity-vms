import storage from './storage'

/**
 *
 * @param data the data (typically any non-circular javascript object) to upload to ipfs
 * @returns the url (ipfs://...) to the data
 */
const uploadToIPFS = async (data: any) => {
  const upload = await storage.upload(data)
  const url = storage.resolveScheme(upload)
  return url
}

export default uploadToIPFS
