import { signMessage } from '@wagmi/core'

import lensClient from './lensClient'

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
