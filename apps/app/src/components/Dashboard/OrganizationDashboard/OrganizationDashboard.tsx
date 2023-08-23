import {
  ClipboardCheckIcon,
  CogIcon,
  GlobeIcon,
  HomeIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientWrapper from '@/components/Shared/Gradient/GradientWrapper'
import Sidebar from '@/components/Sidebar/Sidebar'

import { IDashboardTab } from '../VolunteerDashboard/VolunteerDashboard'
import OrganizationCausesTab from './OrganizationCauses'
import OrganizationHomeTab from './OrganizationHome'
import OrganizationLogVHRTab from './OrganizationLogVHR/OrganizationLogVHR'
import OrganizationVHRTab from './OrganizationVHR'
import VolunteerManagementTab from './VolunteerManagement'

/**
 * Component that displays page layout and dashboard tabs definitions for volunteer dashboard
 *
 * Tabs are displayed using a {@link Sidebar} component, and implement a {@link IDashboardTab}.
 */
const OrganizationDashboard: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.tabs'
  })
  const [selectedTab, setSelectedTab] = useState(1)

  const tabs: IDashboardTab[] = [
    {
      label: 'ORGANIZATION',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    {
      label: t('home'),
      icon: <HomeIcon className="inline" />,
      component: <OrganizationHomeTab />
    },
    {
      label: 'MANAGEMENT',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    {
      label: 'VHR',
      icon: <StarIcon className="inline" />,
      component: <OrganizationVHRTab />
    },
    {
      label: t('projects'),
      icon: <GlobeIcon className="inline" />,
      component: <OrganizationCausesTab />
    },
    {
      label: 'RECRUITMENT',
      icon: <div></div>,
      component: <div></div>,
      isGroup: true
    },
    //Placeholder for Applications component
    {
      label: 'Applications',
      icon: <ClipboardCheckIcon className="inline" />,
      component: <VolunteerManagementTab />
    },
    {
      label: t('verify'),
      icon: <LockClosedIcon className="inline" />,
      component: <OrganizationLogVHRTab />
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

export default OrganizationDashboard
