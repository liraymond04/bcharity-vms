import {
  ArrowLeftIcon,
  GlobeIcon,
  LockClosedIcon
  //TrashIcon
} from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import SideBar2 from '@/components/Sidebar/SideBar2'

import { ITabProps } from '../Sidebar/Sidebar'
import Permissons from './Permissons'
//import UserDelete from './UserDelete'
import UserDispatcher from './UserDispatcher'
import UserHome from './UserHome'
export interface IDashboardTab extends ITabProps {
  component: React.ReactElement
}

/**
 * Component that displays page layout and dashboard tabs definitions for the user settings page
 *
 * Tabs are displayed using a {@link SideBar2} component.
 */
const UserDashboard: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.tabs'
  })
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: t('profile'),
      icon: <UserIcon className="inline" />,
      component: <UserHome />
    },
    {
      label: t('dispatcher'),
      icon: <GlobeIcon className="inline" />,
      component: <UserDispatcher />
    },
    {
      label: t('permissions'),
      icon: <LockClosedIcon className="inline" />,
      component: <Permissons />
    },
    {
      label: t('back'),
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
