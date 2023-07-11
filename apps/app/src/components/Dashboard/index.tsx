import { NextPage } from 'next'
import SEO from '@components/utils/SEO'
import Sidebar, { ITabProps } from '../Sidebar/Sidebar'
import { useState } from 'react'
import { CogIcon, PhoneOutgoingIcon, UserIcon } from '@heroicons/react/outline'

const Dashboard: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: ITabProps[] = [
    {
      label: 'Tab 1 test test test',
      icon: <UserIcon className="w-4 inline" />
    },
    {
      label: 'Tab 2 test test',
      icon: <CogIcon className="w-4 inline" />
    },
    {
      label: 'Tab 3 test',
      icon: <PhoneOutgoingIcon className="w-4 inline" />
    }
  ]

  return (
    <>
      <SEO title="Dashboard • BCharity VMS" />
      <div className="flex">
        <Sidebar
          emptyTop
          selectedIndex={selectedTab}
          setSelectedIndex={setSelectedTab}
          tabs={tabs}
        />
        <div className="grow">Page Content</div>
      </div>
    </>
  )
}

export default Dashboard
