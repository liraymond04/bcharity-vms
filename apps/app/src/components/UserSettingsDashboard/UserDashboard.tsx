import {
  ArrowLeftIcon,
  GlobeIcon,
  LockClosedIcon,
  TrashIcon
} from '@heroicons/react/outline'
import { CogIcon, UserIcon } from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import SideBar2 from '@/components/Sidebar/SideBar2'

import { ITabProps } from '../Sidebar/Sidebar'
import Permissons from './Permissons'
import UserDelete from './UserDelete'
import UserDispatcher from './UserDispatcher'
import UserHome from './UserHome'
import UserSettings from './UserSetting'
export interface IDashboardTab extends ITabProps {
  component: React.ReactElement
}

const UserDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'Profile',
      icon: <UserIcon className="inline" />,
      component: <UserHome />
    },
    {
      label: 'Settings',
      icon: <CogIcon className="inline" />,
      component: <UserSettings />
    },
    {
      label: 'Dispatcher',
      icon: <GlobeIcon className="inline" />,
      component: <UserDispatcher />
    },
    {
      label: 'Permissions',
      icon: <LockClosedIcon className="inline" />,
      component: <Permissons />
    },
    {
      label: 'Delete Account',
      icon: <TrashIcon className="inline" />,
      component: <UserDelete />
    },
    {
      label: 'Back',
      icon: <ArrowLeftIcon className="inline" />,
      component: <div></div>
    }
  ]

  return (
    <div className="flex">
      <SideBar2
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

export default UserDashboard
