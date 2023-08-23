import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/UI'
import { getAvatar, VolunteerData } from '@/lib/lens-protocol'

interface VolunteerApplicationCardProps {
  vol: VolunteerData
}

const VolunteerDataCard: React.FC<VolunteerApplicationCardProps> = ({
  vol
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.volunteer-managment'
  })

  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const location = useMemo(() => {
    return vol.profile?.attributes?.find((attr) => attr.key === 'location')
      ?.value
  }, [vol])

  return (
    <Card className="pt-10 pl-10 pr-10 justify-center">
      <div className="justify-center font-black text-3xl py-4">
        Volunteer Information
      </div>

      <div className="justify-start flex">
        <div className="text-violet-500">
          {vol.profile.name ?? vol.profile.handle}&nbsp;
        </div>
      </div>
      <div className="flex">
        {vol.profile.coverPicture !== undefined && (
          <img
            className="rounded-sm py-3"
            src={getAvatar(vol.profile)}
            alt="Rounded avatar"
            style={{ width: '100px', height: 'auto' }}
          />
        )}
        <div className="flex justify-between py-3 pl-5">
          <div className="text-violet-500">bio:&nbsp;</div>
          <p>{vol.profile.bio}</p>
        </div>
      </div>
      <div className="flex">
        <div className="text-violet-500">location:&nbsp;</div>
        <p>{location ?? ''}</p>

        {/* placeholder */}
      </div>
      <div className="flex">
        <div className="text-violet-500">Date joined:&nbsp;</div>
        <p>{vol.dateJoined}</p>
      </div>

      <div className="text-violet-500 pb-2">Active Volunteer Opportunities</div>
      <div>
        {vol.currentOpportunities.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between bg-brand-300 rounded-sm"
          >
            <p>{o.startDate}</p>
            <p>{o.name}</p>
            <p></p>
          </div>
        ))}
      </div>
      <div className="text-violet-500 pb-2">
        Completed volunteer opportunities
      </div>
      <div>
        {vol.completedOpportunities.map((o) => (
          <div
            key={o.post_id}
            className="flex items-center justify-between bg-brand-300 rounded-sm"
          >
            <p>{o.createdAt}</p>
            <p>{o.opportunity.name}</p>
            <p>{o.hoursToVerify} VHR</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default VolunteerDataCard
