import Router from 'next/router'
import React, { useState } from 'react'

import TabTitle from './TabTile'

/**
 * Properties of a tab tile item in {@link Sidebar}
 */
export interface ITabProps {
  /**
   * Component for the tab tile icon
   */
  icon: React.ReactElement
  /**
   * String of the tab tile label
   */
  label: string
  /**
   * URL the tab should redirect to.
   *
   * If a redirect URL is not provided, then the tab tile
   * will not redirect.
   */
  redirect?: string
  /**
   * Whether the tab tile is not an item, and is instead
   * a group label
   */
  isGroup?: boolean
}

/**
 * Properties of {@link Sidebar}
 */
export interface ISidebarProps {
  /**
   * Whether to add an empty tab tile at the top of the side bar
   * for spacing
   */
  emptyTop?: boolean
  /**
   * The index of the currently selected tab tile
   */
  selectedIndex: number
  /**
   * Function to set the currently selected tab tile
   * @param i
   * @returns
   */
  setSelectedIndex: (i: number) => void
  /**
   * Array of the sidebar's tab tiles
   */
  tabs: ITabProps[]
}

/**
 * Component that displays a sidebar for the dashboard page.
 *
 * Items are supplied as an array of {@link ITabProps}, and mapped to
 * {@link TabTitle}.
 *
 * Used in {@link Dashboard} to display the Dashboard sidebar items.
 */
const Sidebar: React.FC<ISidebarProps> = ({
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
          if (tab.isGroup) {
            if (!openSidebar) return <div />
            return (
              <div
                className="text-[20px] font-sans text-white items-center pl-3 py-2"
                key={i}
              >
                {tab.label}
              </div>
            )
          }
          return (
            <TabTitle
              key={i}
              selected={i === selectedIndex}
              onClick={() => {
                if (tab.redirect) Router.push(tab.redirect)
                setSelectedIndex(i)
              }}
              changeOpen={() => {}}
              open={openSidebar}
              {...tab}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
