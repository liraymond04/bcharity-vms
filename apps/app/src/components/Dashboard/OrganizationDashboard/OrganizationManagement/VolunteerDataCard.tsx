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
        <p> wants to work with your organization</p>
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
    </Card>
  )
}

export default VolunteerDataCard
