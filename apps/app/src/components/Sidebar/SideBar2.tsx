import Router from 'next/router'
import React, { useState } from 'react'

import TabTitle from './TabTile'

/**
 * Properties of a tab tile item in {@link Sidebar2}
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
}

/**
 * Properties of {@link Sidebar2}
 */
export interface ISidebar2Props {
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
 * Component that displays a sidebar for the user settings page.
 *
 * Items are supplied as an array of {@link ITab2Props}, and mapped to
 * {@link TabTitle}.
 *
 * Used in {@link UserSettings} to display the user settings sidebar items.
 */
const Sidebar2: React.FC<ISidebar2Props> = ({
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
