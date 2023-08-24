import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, ErrorMessage, Spinner } from '@/components/UI'
import { getAvatar, lensClient } from '@/lib/lens-protocol'
import { ApplicationMetadata } from '@/lib/metadata'

import { getFormattedDate } from './VolunteerManagement'

interface VolunteerApplicationCardProps {
  application: ApplicationMetadata
  onAccept: VoidFunction
  onReject: VoidFunction
  pending?: boolean
}

const VolunteerApplicationCard: React.FC<VolunteerApplicationCardProps> = ({
  application,
  onAccept,
  onReject,
  pending
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.volunteer-managment'
  })

  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [userProfile, setUserProfile] = useState<ProfileFragment>()

  const [profileDataLoading, setProfileDataLoading] = useState(false)
  const [profileError, setProfileError] = useState('test')

  useEffect(() => {
    setProfileDataLoading(true)
    setProfileError('')

    lensClient()
      .profile.fetch({
        profileId: application.from.id
      })
      .then((p) => {
        if (p) {
          setUserProfile(p)
        } else {
          setProfileError(e('profile-null'))
        }
      })
      .catch((e) => {
        setProfileError(e?.message ?? e)
      })
      .finally(() => setProfileDataLoading(false))
  }, [application.from.id])

  const location = useMemo(() => {
    return userProfile?.attributes?.find((attr) => attr.key === 'location')
      ?.value
  }, [userProfile])

  return (
    <Card className="pt-10 pl-10 pr-10 justify-center">
      {profileError && <ErrorMessage error={new Error(profileError)} />}
      <div className="justify-center font-black text-3xl py-4">
        Volunteer Information
      </div>

      <div className="justify-start flex">
        <div className="text-violet-500">
          {application.from.name ?? application.from.handle}&nbsp;
        </div>
        <p> wants to work with your organization</p>
      </div>
      <div className="flex flex-wrap">
        <div className="shrink-0">
          {application.from.coverPicture !== undefined && (
            <img
              className="rounded-sm py-3 "
              src={getAvatar(application.from)}
              alt="Rounded avatar"
              style={{ width: '100px', height: 'auto' }}
            />
          )}
        </div>

        <div className="flex justify-between py-3 pl-5">
          <div className="text-violet-500">bio:&nbsp;</div>
          <p>{application.from.bio}</p>
        </div>
      </div>
      <div className="flex">
        <div className="text-violet-500">Location:&nbsp;</div>
        {profileDataLoading ? <Spinner /> : <p>{location ?? ''}</p>}

        {/* placeholder */}
      </div>
      <div className="flex">
        <div className="text-violet-500">Date created:&nbsp;</div>
        <p>{getFormattedDate(application.createdAt)}</p>
      </div>
      <div className="flex">
        <div className="text-violet-500">Resume:&nbsp;</div>
        <Link
          href={application.resume.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          target="_blank"
          className="flex"
        >
          <div className="flex items-center hover:underline">
            <div className="mr-1 whitespace-nowrap" suppressHydrationWarning>
              Link to resume PDF
            </div>
            <ExternalLinkIcon className="w-4 h-4 inline-flex mb-1" />
          </div>
        </Link>
      </div>
      <div className="flex">
        <div className="text-violet-500">Description:&nbsp;</div>
        <p>{application.description}</p>
      </div>
      <div className="flex mt-40">
        {' '}
        <Button
          className="my-5"
          suppressHydrationWarning
          onClick={onReject}
          disabled={pending}
        >
          Reject
        </Button>
        <Button
          className="my-5 ml-40"
          suppressHydrationWarning
          onClick={onAccept}
          disabled={pending}
        >
          Accept
        </Button>
      </div>
    </Card>
  )
}

export default VolunteerApplicationCard
