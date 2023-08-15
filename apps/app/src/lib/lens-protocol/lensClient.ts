import { development, LensClient } from '@lens-protocol/client'

let globalTemporal = global as unknown as { client: LensClient }

/**
 * A function that initializes the lens client if it has not been initialized and
 * returns a reference to the global lens client
 *
 * @returns A reference to the global lens client
 * Also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.LensClient.html}
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
