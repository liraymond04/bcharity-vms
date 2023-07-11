import React from 'react'

import TabTitle from './TabTile'

export interface ITabProps {
  icon: React.ReactElement
  label: string
}

interface ISidebarProps {
  emptyTop?: boolean
  selectedIndex: number
  setSelectedIndex: (i: number) => void
  tabs: ITabProps[]
}

const Sidebar: React.FC<ISidebarProps> = ({
  emptyTop,
  selectedIndex,
  setSelectedIndex,
  tabs
}) => {
  return (
    <div className="w-sidebar from-violet-400 to-violet-300 bg-gradient-to-b h-screen">
      {emptyTop && (
        <TabTitle selected={false} onClick={() => {}} icon={<div />} label="" />
      )}
      <div className="flex flex-col">
        {tabs.map((tab, i) => {
          return (
            <TabTitle
              key={i}
              selected={i === selectedIndex}
              onClick={() => setSelectedIndex(i)}
              {...tab}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
