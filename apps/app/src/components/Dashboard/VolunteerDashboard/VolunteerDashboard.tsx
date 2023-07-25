import {
  GlobeIcon,
  HomeIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import Sidebar, { ITabProps } from '@/components/Sidebar/Sidebar'

import VolunteerCausesTab from './VolunteerCauses'
import VolunteerHomeTab from './VolunteerHome'
import VolunteerVHRTab from './VolunteerVHR'

export interface IDashboardTab extends ITabProps {
  component: React.ReactElement
}

const VolunteerDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'Home',
      icon: <HomeIcon className="inline" />,
      component: <VolunteerHomeTab />
    },
    {
      label: 'VHR',
      icon: <StarIcon className="inline" />,
      component: <VolunteerVHRTab />
    },
    {
      label: 'Fundraisers',
      icon: <GlobeIcon className="inline" />,
      component: <VolunteerCausesTab />
    },
    {
      label: 'User Settings',
      icon: <LockClosedIcon className="inline" />,
      component: <div />,
      redirect: '/settings'
    }
  ]

  return (
    <div className="flex">
      <Sidebar
        emptyTop
        selectedIndex={selectedTab}
        setSelectedIndex={setSelectedTab}
        tabs={tabs}
      />
      <div className="grow">
        <GradientWrapper>
          <div className="min-h-screen">{tabs[selectedTab].component}</div>
        </GradientWrapper>
      </div>
    </div>
  )
}

export default VolunteerDashboard
