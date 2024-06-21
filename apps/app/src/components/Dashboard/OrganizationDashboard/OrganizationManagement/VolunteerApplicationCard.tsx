import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, ErrorMessage, Spinner } from '@/components/UI'
import { getAvatar, lensClient } from '@/lib/lens-protocol'
import { ApplicationMetadata } from '@/lib/metadata'

import { getFormattedDate } from './VolunteerManagement'

/**
 * Properties of {@link VolunteerApplicationCard}
 */
export interface VolunteerApplicationCardProps {
  /**
   * Metadata of application post
   */
  application: ApplicationMetadata
  /**
   * Function to run if application is accepted
   */
  onAccept: VoidFunction
  /**
   * Function to run if application is rejected
   */
  onReject: VoidFunction
  /**
   * Whether there is data loading
   */
  pending?: boolean
}

/**
 * Component that displays a styled card for an individual application.
 *
 * The profile data of the volunteer applying to the application is fetched
 * using the Lens {@link https://docs.lens.xyz/docs/get-profile#using-lensclient-sdk | profile.fetch}
 * method, and the profile ID provided by the application metadata.
 *
 * Non manual applications use the profile ID of the poster of the publication,
 * and manual applications use the profile ID provided in the description of
 * the application.
 */
const VolunteerApplicationCard: React.FC<VolunteerApplicationCardProps> = ({
  application,
  onAccept,
  onReject,
  pending
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.management.applications'
  })

  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [userProfile, setUserProfile] = useState<ProfileFragment>()

  const [profileDataLoading, setProfileDataLoading] = useState(false)
  const [profileError, setProfileError] = useState('test')

  useEffect(() => {
    setProfileDataLoading(true)
    setProfileError('')

    let profileId = application.from.id
    if (application.manual === 'true') profileId = application.description

    lensClient()
      .profile.fetch({
        forProfileId: profileId
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
    return userProfile?.metadata?.attributes?.find(
      (attr) => attr.key === 'location'
    )?.value
  }, [userProfile])

  return (
    <Card className="pt-10 pl-10 pr-10 justify-center">
      {profileError && <ErrorMessage error={new Error(profileError)} />}
      <div
        className="justify-center font-black text-3xl py-4"
        suppressHydrationWarning
      >
        {t('volunteer-information')}
      </div>

      {!userProfile ? (
        <Spinner className="m-4" />
      ) : (
        <>
          <div className="justify-start flex">
            <div className="text-violet-500">
              {
                userProfile.id ?? userProfile.handle // is id correct here?
              }
              &nbsp;
            </div>
            <p suppressHydrationWarning>{t('wants-to')}</p>
          </div>
          <div className="flex flex-wrap">
            <div className="shrink-0">
              <img
                className="rounded-sm py-3 "
                src={getAvatar(userProfile)}
                alt="Rounded avatar"
                style={{ width: '100px', height: 'auto' }}
              />
            </div>

            <div className="flex justify-between py-3 pl-5">
              <div className="text-violet-500" suppressHydrationWarning>
                {t('bio')}&nbsp;
              </div>
              <p>{userProfile.metadata?.bio}</p>
            </div>
          </div>
          <div className="flex">
            <div className="text-violet-500" suppressHydrationWarning>
              {t('location')}&nbsp;
            </div>
            {profileDataLoading ? <Spinner /> : <p>{location ?? ''}</p>}

            {/* placeholder */}
          </div>
          <div className="flex">
            <div className="text-violet-500" suppressHydrationWarning>
              {t('date-created')}&nbsp;
            </div>
            <p>{getFormattedDate(application.createdAt)}</p>
          </div>
          {application.resume !== '' && (
            <div className="flex">
              <div className="text-violet-500" suppressHydrationWarning>
                {t('resume')}&nbsp;
              </div>
              <Link
                href={application.resume.replace(
                  'ipfs://',
                  'https://ipfs.io/ipfs/'
                )}
                target="_blank"
                className="flex"
              >
                <div className="flex items-center hover:underline">
                  <div
                    className="mr-1 whitespace-nowrap"
                    suppressHydrationWarning
                  >
                    {t('link-to-resume')}
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 inline-flex mb-1" />
                </div>
              </Link>
            </div>
          )}

          <div className="flex">
            <div className="text-violet-500" suppressHydrationWarning>
              {t('description')}&nbsp;
            </div>
            <p suppressHydrationWarning>
              {application.manual === 'false'
                ? application.description
                : t('manual')}
            </p>
          </div>
          <div className="flex mt-40">
            {' '}
            <Button
              className="my-5"
              suppressHydrationWarning
              onClick={onReject}
              disabled={pending}
            >
              {t('reject')}
            </Button>
            <Button
              className="my-5 ml-40"
              suppressHydrationWarning
              onClick={onAccept}
              disabled={pending}
            >
              {t('accept')}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

export default VolunteerApplicationCard
