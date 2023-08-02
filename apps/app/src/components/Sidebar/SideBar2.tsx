import Router from 'next/router'
import React, { useState } from 'react'

import TabTitle from './TabTile'

export interface ITabProps {
  icon: React.ReactElement
  label: string
  redirect?: string
}
interface ISidebarProps {
  emptyTop?: boolean
  selectedIndex: number
  setSelectedIndex: (i: number) => void
  tabs: ITabProps[]
}

const Sidebar2: React.FC<ISidebarProps> = ({
  emptyTop,
  selectedIndex,
  setSelectedIndex,
  tabs
}) => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(true)

  return (
    <div
      className={`w-sidebar shrink-0 from-violet-400 to-violet-300 dark:from-SideBar dark:to-SideBar bg-gradient-to-b min-h-screen ${
        openSidebar ? '' : 'max-w-[50px]'
      }`}
    >
      {emptyTop && (
        <TabTitle
          selected={false}
          onClick={() => {}}
          icon={<div />}
          label=""
          className="hover:bg-opacity-0 hover:cursor-default"
          changeOpen={() => setOpenSidebar(!openSidebar)}
          open={openSidebar}
        />
      )}
      <div className="flex flex-col">
        {tabs.map((tab, i) => {
          return (
            <TabTitle
              key={i}
              selected={i === selectedIndex}
              onClick={() => {
                if (tab.label == 'Back') Router.push('dashboard')
                else setSelectedIndex(i)
              }}
              {...tab}
              open={openSidebar}
              changeOpen={() => {
                setOpenSidebar(!openSidebar)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar2
