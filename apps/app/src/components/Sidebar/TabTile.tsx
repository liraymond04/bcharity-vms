import React from 'react'

interface ITabTitleProps {
  selected: boolean
  label: string
  onClick: () => void
  icon: React.ReactElement
  className?: string | undefined
}

const TabTitle: React.FC<ITabTitleProps> = ({
  selected,
  label,
  onClick,
  icon,
  className
}) => {
  return (
    <div>
      <div
        className={`relative bg-white ${
          selected ? 'bg-opacity-30' : 'bg-opacity-0'
        } ${
          className ? '' : 'hover:bg-opacity-20'
        } hover:cursor-pointer h-12 flex text-white items-center pl-8 ${className}`}
        onClick={() => onClick()}
      >
        <div className="pr-2">{icon}</div>
        <p className={`text-[20px] font-sans`}>{label}</p>
        {selected && (
          <span className="absolute h-12 bg-violet-600 -right-1 w-1 z-10" />
        )}
      </div>
    </div>
  )
}

export default TabTitle
