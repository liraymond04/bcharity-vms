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

/**
 * Interface for dashboard tabs
 */
export interface IDashboardTab extends ITabProps {
  /**
   * Page body component for dashboard tab
   */
  component: React.ReactElement
}

/**
 * Component that displays page layout and dashboard tabs definitions for volunteer dashboard
 *
 * Tabs are displayed using a {@link Sidebar} component.
 */
const VolunteerDashboard: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.volunteer.tabs'
  })
  const [selectedTab, setSelectedTab] = useState(1)

  const tabs: IDashboardTab[] = [
    {
      label: t('volunteer'),
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
      label: t('explore'),
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
      label: t('manage'),
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    //Placeholder for Applications component
    {
      label: t('applications'),
      icon: <ClipboardCheckIcon className="inline" />,
      component: <div></div>
    },
    {
      label: t('log-vhr'),
      icon: <ClockIcon className="inline" />,
      component: <VolunteerLogHoursTab />
    },
    {
      label: t('settings-group'),
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
    <div className="flex max-w-screen overflow-scroll">
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
