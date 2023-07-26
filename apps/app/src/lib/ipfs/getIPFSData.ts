import storage from './storage'

const getIPFSData = async (url: string) => {
  const data = await storage.download(url)
  // const url = storage.resolveScheme(upload)
  const blob = await data.blob()
  const objectURL = URL.createObjectURL(blob)
  return objectURL
}

export default getIPFSData
