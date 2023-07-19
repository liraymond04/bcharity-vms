import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import uploadToIPFS from '@/lib/ipfsUpload'
//import { Spinner } from '@/components/UI/Spinner'
import lensClient from '@/lib/lens-protocol/lensClient'

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
        if (profileId) {
          const attributes = {
            website: website || null
          }

          const avatarUrl = avatar ? await uploadToIPFS(avatar) : null

          const metadataUrl = 'url'

          const metadataResult =
            await lensClient().profile.createSetProfileMetadataTypedData({
              metadata: metadataUrl,
              profileId: profileId
            })

          await lensClient().profile.update({
            profileId: profileId,
            name: name,
            location: location,
            bio: bio,
            attributes: attributes,
            avatar: avatarUrl
          })

          console.log('Profile saved successfully')
        } else {
          console.error('Invalid profile ID or profile data')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }

    return (
      <GridLayout>
        <GridItemTwelve>
          <Card>
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
          </Card>
        </GridItemTwelve>
      </GridLayout>
    )
  }
}

export default UserSetting
