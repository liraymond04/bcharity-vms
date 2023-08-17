import {
  DotsHorizontalIcon,
  LocationMarkerIcon,
  StarIcon
} from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import { useTranslation } from 'react-i18next'

import { getAvatar } from '@/lib/lens-protocol'

import FollowButton from '../Shared/FollowButton'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

interface IOrganizationCardProps {
  profile: ProfileFragment
  postings: number | undefined
}

const OrganizationCard: React.FC<IOrganizationCardProps> = ({
  profile,
  postings
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.organizations.card'
  })
  return (
    <Card
      className="transition duration-100 hover:scale-105 hover:cursor-pointer"
      onClick={() => {
        window.open(`/p/organization/${profile.handle}`, '_blank')
      }}
    >
      <div className="flex m-5 mr-2">
        <img
          className="w-[100px] h-[100px] fill-current mr-3"
          src={getAvatar(profile)}
          alt={`${profile.handle}${t('pfp')}`}
          suppressHydrationWarning
        />
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <p>{profile.handle}</p>
            <DotsHorizontalIcon className="w-4 text-zinc-400" />
          </div>
          <div className="flex">
            {!postings && (
              <div className="inline">
                <Spinner size="xs" className="mr-2" />
              </div>
            )}
            <p className="inline" suppressHydrationWarning>{`${
              postings ?? ''
            } ${t('postings')}`}</p>
          </div>
          <div className="flex justify-between grow">
            <div>
              <LocationMarkerIcon className="w-4 inline" />
              <p className="inline" suppressHydrationWarning>
                {t('location')}
              </p>
            </div>
            <FollowButton
              icon={<StarIcon className="w-4 align-end text-white" />}
              className="h-8 place-self-end"
              followId={profile.id}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OrganizationCard
