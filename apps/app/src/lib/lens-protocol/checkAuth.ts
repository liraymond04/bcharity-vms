import { signMessage } from '@wagmi/core'
import router from 'next/router'

import { resetCurrentUser } from '@/store/app'

import lensClient from './lensClient'

const logout = () => {
  if (router.pathname === '/dashboard' || router.pathname === '/settings') {
    router.push('/')
  }
  resetCurrentUser()
  localStorage.removeItem('bcharity.store')
}

const checkAuth = async (address: string) => {
  try {
    const authenticated = await lensClient().authentication.isAuthenticated()
    if (!authenticated) {
      const challenge = await lensClient().authentication.generateChallenge(
        address
      )
      const signature = await signMessage({ message: challenge })

      await lensClient().authentication.authenticate(address, signature)
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === 'ConnectorNotFoundError') {
        logout()
      }
      throw e
    }
  }
}

export default checkAuth
