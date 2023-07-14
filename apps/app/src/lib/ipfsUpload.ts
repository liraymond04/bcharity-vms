import { ThirdwebStorage } from '@thirdweb-dev/storage'
const storage = new ThirdwebStorage()

const uploadToIPFS = async (data: any) => {
  const upload = await storage.upload(data)
  const url = storage.resolveScheme(upload)
  return url
}

export default uploadToIPFS
