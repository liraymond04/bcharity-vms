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
import VolunteerSettingsTab from './VolunteerSettings'
import VolunteerVHRTab from './VolunteerVHR'

export interface IDashboardTab extends ITabProps {
  component: React.ReactElement
}

const VolunteerDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'Home',
      icon: <HomeIcon className="w-4 inline" />,
      component: <VolunteerHomeTab />
    },
    {
      label: 'VHR',
      icon: <StarIcon className="w-4 inline" />,
      component: <VolunteerVHRTab />
    },
    {
      label: 'Causes',
      icon: <GlobeIcon className="w-4 inline" />,
      component: <VolunteerCausesTab />
    },
    {
      label: 'User Settings',
      icon: <LockClosedIcon className="w-4 inline" />,
      component: <VolunteerSettingsTab />
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
