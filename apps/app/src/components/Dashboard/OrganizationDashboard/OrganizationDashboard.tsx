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

const VolunteerDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'Home',
      icon: <HomeIcon className="w-4 inline" />,
      component: <></>
    },
    {
      label: 'VHR',
      icon: <StarIcon className="w-4 inline" />,
      component: <></>
    },
    {
      label: 'Causes',
      icon: <GlobeIcon className="w-4 inline" />,
      component: <></>
    },
    {
      label: 'User Settings',
      icon: <LockClosedIcon className="w-4 inline" />,
      component: <></>
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
      <div className="grow">Page Content</div>
    </div>
  )
}

export default VolunteerDashboard
