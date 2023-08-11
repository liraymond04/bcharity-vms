import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Input } from '@/components/UI/Input'
import { TextArea } from '@/components/UI/TextArea'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import getSignature from '@/lib/lens-protocol/getSignature'
import lensClient from '@/lib/lens-protocol/lensClient'
import {
  AttributeData,
  MetadataDisplayType,
  MetadataVersion,
  ProfileMetadata
} from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { ErrorMessage } from '../UI/ErrorMessage'
import { Spinner } from '../UI/Spinner'
import SelectAvatar from './UserHome/SelectAvatar'

const VolunteerHomeTab: React.FC = () => {
  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()

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
          setUserHandle(currentUser.handle)

          const userProfile = await lensClient().profile.fetch({
            profileId: currentUser?.id
          })

          if (userProfile) {
            setName(userProfile.name || '')

            if (userProfile.attributes) {
              const locationAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'location'
              )
              setLocation(locationAttribute?.value || '')
              const websiteAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'website'
              )
              setWebsite(websiteAttribute?.value || '')
              const discordAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'discord'
              )
              setDiscord(discordAttribute?.value || '')
              const twitterAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'twitter'
              )
              setTwitter(twitterAttribute?.value || '')
              const linkedinAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'linkedin'
              )
              setLinkedin(linkedinAttribute?.value || '')
            }
            setBio(userProfile.bio || '')
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
        await checkAuth(currentUser?.ownedBy)

        if (discord.length > 100)
          throw Error('Length of Discord invite input is too long!')
        if (twitter.length > 100)
          throw Error('Length of Twitter profile input is too long!')
        if (linkedin.length > 100)
          throw Error('Length of LinkedIn profile input is too long!')

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

        if (!metadataUrl) throw Error('Metadata upload failed')

        const typedDataResult =
          await lensClient().profile.createSetProfileMetadataTypedData({
            metadata: metadataUrl,
            profileId: currentUser?.id
          })

        const signature = await signTypedData(
          getSignature(typedDataResult.unwrap().typedData)
        )

        const broadcastResult = await lensClient().transaction.broadcast({
          id: typedDataResult.unwrap().id,
          signature: signature
        })
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
                <div>Profile ID:</div>{' '}
                <div className="font-bold text-lg">{userId}</div>
              </div>
              <div className="flex space-x-1 items-baseline">
                <div>Profile Handle:</div>{' '}
                <div className="font-bold text-lg">{userHandle}</div>
              </div>
            </div>
            <div>
              <Input
                label="Name: "
                type="text"
                id="name"
                value={name}
                placeholder="Gavin"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Location: "
                type="text"
                id="location"
                value={location}
                placeholder="Calgary"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <TextArea
                label="Bio: "
                id="bio"
                value={bio}
                placeholder="Tell us something about you!"
                onChange={(e) => setBio(e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <Input
                label="Website: "
                type="text"
                id="website"
                value={website}
                placeholder="https://hooli.com"
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Discord: "
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
                label="Twitter: "
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
                label="LinkedIn: "
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
                label="Cover: "
                type="file"
                id="cover"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="my-5"
                disabled={isLoading}
                icon={isLoading && <Spinner size="sm" />}
                type="submit"
              >
                Save
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
