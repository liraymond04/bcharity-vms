import WalletSelector from '@components/Shared/Navbar/Login/WalletSelector'
import { ProfileFragment } from '@lens-protocol/client'
import { signMessage } from '@wagmi/core'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IS_MAINNET, STATIC_ASSETS } from 'src/constants'
import { useAccount } from 'wagmi'

import { Button } from '@/components/UI'
import { config } from '@/lib/config'
import { getAvatar, getProfilesOwnedBy, lensClient } from '@/lib/lens-protocol'
import { useAppPersistStore, useAppStore } from '@/store/app'

import Create from './Create'
/**
 * A component that handles Lens login, and prompting profile creation
 *
 * Uses {@link WalletSelector} to handle signing wallet addresses, and
 * {@link Create} to create a Lens profile if an address has none
 */
const Login: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  )

  const { address, connector: activeConnector } = useAccount()
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.navbar.login'
  })

  const { profiles, setProfiles } = useAppStore()

  const [fetchedProfiles, setFetchedProfiles] = useState<ProfileFragment[]>([])

  useEffect(() => {
    const fetch = async () => {
      if (address) {
        const profiles = await getProfilesOwnedBy(address)
        setFetchedProfiles(profiles)
      }
    }

    fetch()
  }, [fetchedProfiles, address])

  const handleSign = async (id?: string) => {
    try {
      setLoggingInProfileId(id || null)
      setIsLoading(true)

      if (!address) {
        throw Error()
      }

      // Get challenge
      const challenge = await lensClient().authentication.generateChallenge({
        for: id,
        signedBy: address
      })

      if (!challenge?.text) {
        throw Error('Something went wrong')
      }

      // Get signature
      const signature = await signMessage(config, {
        message: challenge.text
      })

      await lensClient().authentication.authenticate({
        id: challenge.id,
        signature
      })

      if (await lensClient().authentication.isAuthenticated()) {
        const profiles = await getProfilesOwnedBy(address)
        setProfiles(profiles)
      } else {
        throw Error('Authentication failed')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const { setIsAuthenticated, setCurrentUser } = useAppPersistStore()

  useEffect(() => {
    if (profiles) {
      if (profiles.length === 0) {
      } else {
        setIsAuthenticated(true)
        setProfiles(profiles)
        setCurrentUser(profiles[0])
      }
    }
  }, [profiles, setCurrentUser, setIsAuthenticated, setProfiles])

  return (
    <div className="p-5">
      {activeConnector?.id && profiles.length > 0 ? (
        fetchedProfiles?.length > 0 ? (
          <div>
            {fetchedProfiles.map((profile) => (
              <div
                className="flex items-center justify-between p-3"
                key={profile.id}
              >
                <div className="flex items-center space-x-3">
                  <img
                    className="w-5 h-5 rounded-full border dark:border-gray-700/80"
                    height={20}
                    width={20}
                    src={getAvatar(profile)}
                    alt={profile?.handle?.localName}
                  />
                  <div className="font-bold text-left">
                    {profile?.handle?.localName}
                  </div>
                </div>
                <Button
                  disabled={isLoading && loggingInProfileId === profile.id}
                  onClick={() => handleSign(profile.id)}
                  outline
                >
                  Login
                </Button>
              </div>
            ))}
          </div>
        ) : IS_MAINNET ? (
          <div>
            <div className="mb-2 space-y-4">
              <img
                className="w-16 h-16 rounded-full"
                height={64}
                width={64}
                src={`${STATIC_ASSETS}/brands/lens.png`}
                alt="Logo"
              />
              <div className="text-xl font-bold" suppressHydrationWarning>
                {t('claim')}
              </div>
              <div className="space-y-1">
                <div className="linkify" suppressHydrationWarning>
                  {t('visit')}{' '}
                  <Link
                    className="font-bold"
                    href="http://claim.lens.xyz"
                    target="_blank"
                    rel="noreferrer noopener"
                    suppressHydrationWarning
                  >
                    {t('claiming-site')}
                  </Link>{' '}
                  {t('finish-claim')}
                </div>
                <div className="text-sm text-gray-500" suppressHydrationWarning>
                  {t('return')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Create isModal />
        )
      ) : (
        <div>
          <div className="space-y-1">
            <div className="text-xl font-bold" suppressHydrationWarning>
              {t('connect')}
            </div>
            <div className="text-sm text-gray-500" suppressHydrationWarning>
              {t('providers')}
            </div>
          </div>
          <WalletSelector />
        </div>
      )}
    </div>
  )
}

export default Login
