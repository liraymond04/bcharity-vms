import storage from './storage'

const uploadToIPFS = async (data: any) => {
  const upload = await storage.upload(data)
  const url = storage.resolveScheme(upload)
  return url
}

export default uploadToIPFS
