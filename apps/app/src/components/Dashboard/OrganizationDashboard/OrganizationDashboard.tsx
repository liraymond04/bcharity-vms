import React from 'react'
import { useState } from 'react'
import {
  GlobeIcon,
  HomeIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/outline'

import Sidebar from '@/components/Sidebar/Sidebar'
import { IDashboardTab } from '../VolunteerDashboard/VolunteerDashboard'
import OrganizationHomeTab from './OrganizationHome'
import OrganizationVHRTab from './OrganizationVHR'
import OrganizationCausesTab from './OrganizationCauses'
import OrganizationSettingsTab from './OrganizationSettings'

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
      label: 'Causes',
      icon: <GlobeIcon className="w-4 inline" />,
      component: <OrganizationCausesTab />
    },
    {
      label: 'User Settings',
      icon: <LockClosedIcon className="w-4 inline" />,
      component: <OrganizationSettingsTab />
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
      <div className="grow">{tabs[selectedTab].component}</div>
    </div>
  )
}

export default OrganizationDashboard
