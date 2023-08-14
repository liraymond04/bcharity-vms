import { signMessage } from '@wagmi/core'

import lensClient from './lensClient'

/**
 * A function to check authentication usually used before continuing with another
 * lens client query that requires authentication.
 *
 * See {@link https://docs.lens.xyz/docs/authentication#using-lensclient-sdk} and {@link https://lens-protocol.github.io/lens-sdk/interfaces/_lens_protocol_client.IAuthentication.html} for lens-related documentation.
 *
 * @param address the Ethereum address of the profile that is requesting authentication
 * (usually obtained from ProfileFragment.ownedBy)
 *
 * @example Check authentication before creating a post
 * ```ts
 * const publisher: ProfileFragment = ...
 * const metadata = ...
 * await checkAuth(publisher.ownedBy)
 * const createPostResult = await createPost(publisher, metadata)
 * ```
 */
const checkAuth = async (address: string) => {
  const authenticated = await lensClient().authentication.isAuthenticated()
  if (!authenticated) {
    const challenge = await lensClient().authentication.generateChallenge(
      address
    )
    const signature = await signMessage({ message: challenge })

    await lensClient().authentication.authenticate(address, signature)
  }
}

export default checkAuth
