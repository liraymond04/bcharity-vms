import {
  ClockIcon,
  CogIcon,
  GlobeIcon,
  HomeIcon,
  StarIcon
} from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import Sidebar, { ITabProps } from '@/components/Sidebar/Sidebar'

import VolunteerCausesTab from './VolunteerCauses'
import VolunteerHomeTab from './VolunteerHome'
import VolunteerLogHoursTab from './VolunteerLogHours'
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
      label: 'Projects',
      icon: <GlobeIcon className="inline" />,
      component: <VolunteerCausesTab />
    },
    {
      label: 'Log VHR',
      icon: <ClockIcon className="inline" />,
      component: <VolunteerLogHoursTab />
    },
    {
      label: 'User Settings',
      icon: <CogIcon className="inline" />,
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
          <div className="min-h-screen overflow-x-scroll">
            {tabs[selectedTab].component}
          </div>
        </GradientWrapper>
      </div>
    </div>
  )
}

export default VolunteerDashboard
