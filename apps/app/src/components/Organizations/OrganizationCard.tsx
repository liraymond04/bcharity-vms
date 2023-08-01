import {
  DotsHorizontalIcon,
  LocationMarkerIcon,
  StarIcon
} from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'

import getAvatar from '@/lib/getAvatar'

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
  return (
    <Card>
      <div className="flex m-1 mr-2">
        <img
          className="w-[100px] h-[100px] rounded-md mr-3"
          src={getAvatar(profile)}
          alt={`${profile.handle}'s profile picture`}
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
            <p className="inline">{`${postings ?? ''} postings`}</p>
          </div>
          <div className="flex justify-between grow">
            <div>
              <LocationMarkerIcon className="w-4 inline" />
              <p className="inline">LOCATION</p>
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
