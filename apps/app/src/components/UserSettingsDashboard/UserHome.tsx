import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import uploadToIPFS from '@/lib/ipfsUpload'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import getSignature from '@/lib/lens-protocol/getSignature'
import lensClient from '@/lib/lens-protocol/lensClient'
import {
  AttributeData,
  MetadataDisplayType,
  MetadataVersions,
  ProfileMetadata
} from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

const VolunteerHomeTab: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [profileId, setProfileId] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [avatar, setAvatar] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
          checkAuth(currentUser?.ownedBy).then(async () => {
            const userProfile = await lensClient().profile.fetch({
              profileId: profileId
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
          })
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }
    fetchProfileData()
  }, [currentUser, profileId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault
    setIsLoading(true)

    try {
      const attributes: AttributeData[] = [
        {
          displayType: MetadataDisplayType.string,
          traitType: 'website',
          value: website,
          key: 'website'
        }
      ]

      const avatarUrl = avatar ? await uploadToIPFS(avatar) : null

      const metadata: ProfileMetadata = {
        version: MetadataVersions.one,
        metadata_id: v4(),
        name,
        bio,
        cover_picture: avatarUrl,
        attributes,
        location
      }

      const metadataUrl = await uploadToIPFS(metadata)

      const typedDataResult =
        await lensClient().profile.createSetProfileMetadataTypedData({
          metadata: metadataUrl,
          profileId: profileId
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      console.log('Profile saved successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <Input
                label="Profile ID: "
                type="profileId"
                id="profileId"
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
                label="Avatar: "
                type="file"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="flex justify-center bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerHomeTab
