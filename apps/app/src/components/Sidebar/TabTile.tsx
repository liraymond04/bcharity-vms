import React from 'react'

interface ITabTitleProps {
  selected: boolean
  label: string
  onClick: () => void
  icon: React.ReactElement
}

const TabTitle: React.FC<ITabTitleProps> = ({
  selected,
  label,
  onClick,
  icon
}) => {
  return (
    <div>
      <div
        className={`${
          selected ? 'bg-white bg-opacity-30' : 'bg-transparent'
        } h-12 flex text-white items-center pl-8`}
        onClick={() => onClick()}
      >
        <div className="pr-2">{icon}</div>
        <p className={`text-[20px] font-sans`}>{label}</p>
      </div>
      {selected && (
        <span className="absolute h-12 bg-violet-600 ml-sidebar -mt-12 w-1 z-10" />
      )}
    </div>
  )
}

export default TabTitle
