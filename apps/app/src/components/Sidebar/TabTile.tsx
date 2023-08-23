import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import React from 'react'

/**
 * Properties of {@link TabTitle}
 */
export interface ITabTitleProps {
  /**
   * Whether the current tab title is selected
   */
  selected: boolean
  /**
   * String of the current tab title's label
   */
  label: string
  /**
   * Function that runs when the component is clicked
   * @returns
   */
  onClick: () => void
  /**
   * Component for the tab tile icon
   */
  icon: React.ReactElement
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string | undefined
  /**
   * Function that runs when the sidebar is collapsed or opened
   * @returns
   */
  changeOpen: () => void
  /**
   * Whether the sidebar is collapsed or opened
   */
  open: boolean
}

/**
 * Component use to display tab title items in sidebars.
 *
 * Used in {@link Sidebar} and {@link Sidebar2}.
 */
const TabTitle: React.FC<ITabTitleProps> = ({
  selected,
  label,
  onClick,
  icon,
  className,
  changeOpen,
  open
}) => {
  return (
    <div>
      <div
        className={`relative bg-accent-content ${
          selected ? 'bg-opacity-30' : 'bg-opacity-0'
        } ${className ? '' : 'hover:bg-opacity-20'} ${
          label != '' && 'hover:cursor-pointer'
        } h-12 flex ${!open && 'justify-around'} text-white items-center ${
          open ? 'pl-8' : 'pl-0'
        } ${className}`}
        onClick={() => onClick()}
      >
        <div className={`${open ? 'pr-2 w-6' : 'w-6'}`}>{icon}</div>

        {open && (
          <p className={`text-[20px] font-sans`} suppressHydrationWarning>
            {label}
          </p>
        )}
        {open && selected && (
          <span className="absolute h-12 bg-blue-800 -right-1 w-1 z-10" />
        )}
        {label == '' &&
          (open ? (
            <div
              className="absolute flex items-center justify-around hover:cursor-pointer h-12 bg-[#A78CFA] opacity-50 -right-0 w-12 z-10 hover:bg-[#906bff] dark:bg-[#23224A] dark:hover:bg-[#35336f]"
              onClick={() => changeOpen()}
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </div>
          ) : (
            <div
              className="absolute flex items-center justify-around hover:cursor-pointer h-12 bg-[#A78CFA] opacity-50 w-12 z-10 hover:bg-[#906bff] dark:bg-[#23224A] dark:hover:bg-[#35336f]"
              onClick={() => changeOpen()}
            >
              <ChevronRightIcon className="w-8 h-8" />
            </div>
          ))}
      </div>
    </div>
  )
}

export default TabTitle
