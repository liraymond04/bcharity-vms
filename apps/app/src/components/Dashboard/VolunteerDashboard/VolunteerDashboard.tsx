import {
  ClipboardCheckIcon,
  ClockIcon,
  CogIcon,
  GlobeIcon,
  HomeIcon,
  StarIcon
} from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.volunteer.tabs'
  })
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: IDashboardTab[] = [
    {
      label: 'VOLUNTEER',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    {
      label: t('home'),
      icon: <HomeIcon className="inline" />,
      component: <VolunteerHomeTab />
    },
    {
      label: 'EXPLORE',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    {
      label: 'VHR',
      icon: <StarIcon className="inline" />,
      component: <VolunteerVHRTab />
    },
    {
      label: t('projects'),
      icon: <GlobeIcon className="inline" />,
      component: <VolunteerCausesTab />
    },
    {
      label: 'MANAGE',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    //Placeholder for Applications component
    {
      label: 'Applications',
      icon: <ClipboardCheckIcon className="w-4 inline" />,
      component: <div></div>
    },
    {
      label: t('log-vhr'),
      icon: <ClockIcon className="inline" />,
      component: <VolunteerLogHoursTab />
    },
    {
      label: 'SETTINGS',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    {
      label: t('settings'),
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
