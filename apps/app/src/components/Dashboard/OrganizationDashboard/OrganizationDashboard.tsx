import {
  CogIcon,
  GlobeIcon,
  HomeIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import Sidebar from '@/components/Sidebar/Sidebar'

import { IDashboardTab } from '../VolunteerDashboard/VolunteerDashboard'
import OrganizationCausesTab from './OrganizationCauses'
import OrganizationHomeTab from './OrganizationHome'
import OrganizationLogVHRTab from './OrganizationLogVHR/OrganizationLogVHR'
import OrganizationVHRTab from './OrganizationVHR'

const OrganizationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'Home',
      icon: <HomeIcon className="w-4 inline" />,
      component: <OrganizationHomeTab />
    },
    {
      label: 'VHR',
      icon: <StarIcon className="w-4 inline" />,
      component: <OrganizationVHRTab />
    },
    {
      label: 'Projects',
      icon: <GlobeIcon className="w-4 inline" />,
      component: <OrganizationCausesTab />
    },
    {
      label: 'Verify VHR',
      icon: <LockClosedIcon className="w-4 inline" />,
      component: <OrganizationLogVHRTab />
    },
    {
      label: 'User Settings',
      icon: <CogIcon className="w-4 inline" />,
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

export default OrganizationDashboard
