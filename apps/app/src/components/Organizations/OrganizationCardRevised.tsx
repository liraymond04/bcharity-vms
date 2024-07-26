import {
  DotsHorizontalIcon,
  LocationMarkerIcon,
  StarIcon
} from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'

import FollowButton from '../Shared/FollowButton'
import { Card } from '../UI/Card'
import { Item } from '.'

/**
 * Properties of {@link OrganizationCard}
 */
export interface IOrganizationCardRevisedProps {
  data: Item
}

/**
 * Component that displays the details of an organization in a styled card.
 * Compatible with data pulled from the VHR list.
 *
 * Used in {@link Organizations}.
 */
const OrganizationCardRevised: React.FC<IOrganizationCardRevisedProps> = ({
  data
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.organizations.card'
  })
  return (
    <div>
      <div
        key={data.index}
        className="flex flex-wrap justify-between overflow-hidden items-center w-[90%] mx-auto my-2 border-b-[1px] border-[#a3a3a3]"
      >
        <Card
          className="transition duration-100 hover:scale-105 hover:cursor-pointer"
          onClick={() => {
            window.open(`/p/organization/${data.handle}`, '_blank')
          }}
        >
          <div className="flex m-5 mr-2">
            <img
              className="w-[100px] h-[100px] rounded-full object-cover mr-3"
              src={data.avatar}
              alt={`${data.handle}${t('pfp')}`}
              suppressHydrationWarning
            />
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <p>{data.handle ? data.handle : data.address}</p>
                <DotsHorizontalIcon className="w-4 text-zinc-400" />
              </div>
              <div className="flex">{data.amount} VHR</div>
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
                  followId={data.address}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrganizationCardRevised
