import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import uploadToIPFS from '@/lib/ipfsUpload'
import getSignature from '@/lib/lens-protocol/getSignature'
//import { Spinner } from '@/components/UI/Spinner'
import lensClient from '@/lib/lens-protocol/lensClient'
import {
  AttributeData,
  MetadataDisplayType,
  MetadataVersions,
  ProfileMetadata
} from '@/lib/types'

const UserSetting = () => {
  function ProfileUpdateForm() {
    const [profileId, setProfileId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [bio, setBio] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [avatar, setAvatar] = useState<File | null>(null)

    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          if (profileId) {
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
          }
        } catch (error) {
          console.error('Error fetching profile data:', error)
        }
      }
      fetchProfileData()
    }, [profileId])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

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
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="location">Location: </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bio">Bio: </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="website">Website: </label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="avatar">Avatar: </label>
              <input
                type="file"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </div>

            <button type="submit">Save</button>
          </form>
        </GridItemTwelve>
      </GridLayout>
    )
  }
}

export default UserSetting
