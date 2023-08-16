import { development, LensClient } from '@lens-protocol/client'

let globalTemporal = global as unknown as { client: LensClient }

/**
 * A function that initializes the {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.LensClient.html | LensClient} if it has not been initialized and
 * returns a reference to it
 *
 * @returns A reference to the global {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.LensClient.html | LensClient}
 */
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
