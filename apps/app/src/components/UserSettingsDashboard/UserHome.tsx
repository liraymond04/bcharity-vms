import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'
import { useConfig } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Input } from '@/components/UI/Input'
import { TextArea } from '@/components/UI/TextArea'
import { checkAuth, getSignature, lensClient } from '@/lib/lens-protocol'
import {
  AttributeData,
  MetadataDisplayType,
  MetadataVersion,
  ProfileMetadata
} from '@/lib/types'
import validImageExtension from '@/lib/validImageExtension'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { ErrorMessage } from '../UI/ErrorMessage'
import { Spinner } from '../UI/Spinner'
import SelectAvatar from './UserHome/SelectAvatar'

/**
 * Component that displays a tab page for editing the current profile's
 * metadata.
 *
 * Editing the current profile metadata is handled with the Lens client {@link https://docs.lens.xyz/docs/create-set-update-profile-metadata-typed-data | createSetProfileMetadataTypedData} method.
 * The metadata standard for the set profile metadata should implement {@link ProfileMetadata},
 * and custom fields such as social media links should be added as custom attributes as an array
 * of {@link AttributeData} in the metadata.
 *
 * The current profile's profile picture is set with {@link SelectAvatar}.
 */
const VolunteerHomeTab: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.home'
  })
  const { t: he } = useTranslation('common', {
    keyPrefix: 'components.settings.home.errors'
  })
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()
  const config = useConfig()

  const [error, setError] = useState<Error>()

  const { currentUser } = useAppPersistStore()
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [discord, setDiscord] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')
  const [linkedin, setLinkedin] = useState<string>('')
  const [cover, setCover] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setError(undefined)
        if (currentUser) {
          setUserId(currentUser.id)
          if (!currentUser.handle) {
            console.error('ERROR: Handle is null!')
            return
          }
          setUserHandle(currentUser.handle.localName)

          const userProfile = await lensClient().profile.fetch({
            forProfileId: currentUser?.id
          })

          if (userProfile) {
            setName(userProfile.id || '')

            if (userProfile.metadata) {
              if (userProfile.metadata.attributes) {
                const locationAttribute = userProfile.metadata.attributes.find(
                  (attr) => attr.key === 'location'
                )
                setLocation(locationAttribute?.value || '')
                const websiteAttribute = userProfile.metadata.attributes.find(
                  (attr) => attr.key === 'website'
                )
                setWebsite(websiteAttribute?.value || '')
                const discordAttribute = userProfile.metadata.attributes.find(
                  (attr) => attr.key === 'discord'
                )
                setDiscord(discordAttribute?.value || '')
                const twitterAttribute = userProfile.metadata.attributes.find(
                  (attr) => attr.key === 'twitter'
                )
                setTwitter(twitterAttribute?.value || '')
                const linkedinAttribute = userProfile.metadata.attributes.find(
                  (attr) => attr.key === 'linkedin'
                )
                setLinkedin(linkedinAttribute?.value || '')
              }
              setBio(userProfile.metadata.bio || '')
            }
          }
          console.log('profile', userProfile)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        }
      }
    }
    fetchProfileData()
  }, [currentUser])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(undefined)

    try {
      if (currentUser) {
        await checkAuth(currentUser?.ownedBy.address)

        if (discord.length > 100) throw Error(he('discord'))
        if (twitter.length > 100) throw Error(he('twitter'))
        if (linkedin.length > 100) throw Error(he('linkedin'))

        const attributes: AttributeData[] = [
          {
            displayType: MetadataDisplayType.string,
            traitType: 'website',
            value: website,
            key: 'website'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'location',
            value: location,
            key: 'location'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'discord',
            value: discord,
            key: 'discord'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'twitter',
            value: twitter,
            key: 'twitter'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'linkedin',
            value: linkedin,
            key: 'linkedin'
          }
        ]

        const avatarUrl = cover ? (await upload({ data: [cover] }))[0] : null

        const metadata: ProfileMetadata = {
          version: MetadataVersion.ProfileMetadataVersions['1.0.0'],
          metadata_id: v4(),
          name,
          bio,
          cover_picture: avatarUrl,
          attributes
        }

        const metadataUrl = sdk?.storage.resolveScheme(
          (await upload({ data: [metadata] }))[0]
        )

        if (!metadataUrl) throw Error(e('metadata-upload-fail'))

        const typedDataResult =
          await lensClient().profile.createSetProfileMetadataTypedData({
            metadataURI: metadataUrl
            //profileId: currentUser?.id // DEPRECATED, i believe
          })

        const signature = await signTypedData(
          config, // not sure if this is correct, added because signTypedData requires a config param
          getSignature(typedDataResult.unwrap().typedData)
        )

        const broadcastResult = await lensClient().transaction.broadcastOnchain(
          {
            id: typedDataResult.unwrap().id,
            signature: signature
          }
        )
      }
      console.log('Profile saved successfully')
    } catch (error) {
      if (error instanceof Error) {
        setError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [userId, setUserId] = useState('')
  const [userHandle, setUserHandle] = useState('')

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <form
            className="my-5 mx-5 flex-col space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="flex space-x-10">
              <div className="flex space-x-1 items-baseline">
                <div suppressHydrationWarning>{t('profile-id')}</div>{' '}
                <div className="font-bold text-lg">{userId}</div>
              </div>
              <div className="flex space-x-1 items-baseline">
                <div suppressHydrationWarning>{t('profile-handle')}</div>{' '}
                <div className="font-bold text-lg">{userHandle}</div>
              </div>
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('name')}
                type="text"
                id="name"
                value={name}
                placeholder="Gavin"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('location')}
                type="text"
                id="location"
                value={location}
                placeholder="Calgary"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <TextArea
                suppressHydrationWarning
                label={t('bio')}
                id="bio"
                value={bio}
                placeholder={t('bio-placeholder')}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('website')}
                type="text"
                id="website"
                value={website}
                placeholder="https://hooli.com"
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('discord')}
                type="text"
                id="discord"
                value={discord}
                prefix="https://discord.gg/"
                placeholder="4vKS59q5kV"
                onChange={(e) => setDiscord(e.target.value)}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('twitter')}
                type="text"
                id="twitter"
                value={twitter}
                prefix="https://twitter.com/"
                placeholder="Gavin"
                onChange={(e) => setTwitter(e.target.value)}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('linkedin')}
                type="text"
                id="linkedin"
                value={linkedin}
                prefix="https://linkedin.com/in/"
                placeholder="gavin"
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <div>
              <Input
                suppressHydrationWarning
                label={t('cover')}
                type="file"
                id="cover"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0]
                  setError(undefined)

                  if (selectedFile && validImageExtension(selectedFile.name)) {
                    setCover(selectedFile)
                  } else {
                    setError(Error(e('invalid-file-type')))
                  }
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="my-5"
                disabled={isLoading}
                icon={isLoading && <Spinner size="sm" />}
                type="submit"
                suppressHydrationWarning
              >
                {t('save')}
              </Button>
            </div>
            {error && <ErrorMessage error={error} />}
          </form>
        </Card>
      </GridItemTwelve>
      <GridItemTwelve>
        <SelectAvatar />
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerHomeTab
