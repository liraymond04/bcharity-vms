import { development, LensClient } from '@lens-protocol/client'

let globalTemporal = global as unknown as { client: LensClient }

const lensClient = () => {
  if (globalTemporal.client) {
    return globalTemporal.client
  }

  globalTemporal.client = new LensClient({
    environment: development
  })

  return globalTemporal.client
}

export const initLensClient = (initState: any) => {
  globalTemporal.client = initState
}

export default lensClient
