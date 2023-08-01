import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import uploadToIPFS from '@/lib/ipfs/ipfsUpload'
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
import SelectAvatar from './UserHome/SelectAvatar'

const VolunteerHomeTab: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [cover, setCover] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
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
            }
            setBio(userProfile.bio || '')
          }
          console.log('profile', userProfile)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }
    fetchProfileData()
  }, [currentUser])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault
    setIsLoading(true)

    try {
      if (currentUser) {
        checkAuth(currentUser?.ownedBy).then(async () => {
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
            }
          ]

          const avatarUrl = cover ? await uploadToIPFS(cover) : null

          const metadata: ProfileMetadata = {
            version: MetadataVersion.ProfileMetadataVersions['1.0.0'],
            metadata_id: v4(),
            name,
            bio,
            cover_picture: avatarUrl,
            attributes
          }

          const metadataUrl = await uploadToIPFS(metadata)

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

          setIsLoading(false)
        })
      }
      console.log('Profile saved successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          {isLoading ? (
            <Spinner />
          ) : (
            <form className="my-5 mx-5" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Profile ID: "
                  type="text"
                  id="profileId"
                  className="text-gray-600 dark:text-gray-500"
                  value={currentUser?.id}
                  readOnly
                />
              </div>
              <div>
                <Input
                  label="Name: "
                  type="text"
                  id="name"
                  value={currentUser?.handle}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Location: "
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <TextArea
                  label="Bio: "
                  id="bio"
                  value={bio}
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
                  onChange={(e) => setWebsite(e.target.value)}
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
                <Button className="my-5" type="submit">
                  Save
                </Button>
              </div>
            </form>
          )}
        </Card>
      </GridItemTwelve>
      <GridItemTwelve>
        <SelectAvatar />
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerHomeTab
