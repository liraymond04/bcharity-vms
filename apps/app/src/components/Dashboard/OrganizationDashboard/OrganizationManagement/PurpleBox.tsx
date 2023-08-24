import { MouseEventHandler } from 'react'

import { getFormattedDate } from './VolunteerManagement'

interface PurpleBoxProps {
  selected?: boolean
  userName: string
  dateCreated: string
  onClick?: MouseEventHandler<HTMLDivElement>
  tab?: string
}

const PurpleBox: React.FC<PurpleBoxProps> = ({
  selected,
  userName,
  dateCreated,
  onClick,
  tab
}) => {
  const boxClassName = selected
    ? 'bg-blue-100 dark:bg-violet-500 scale-105'
    : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
  return (
    <div
      className={`items-center shadow-sm shadow-black px-5 mx-5 my-3 h-16 py-2 hover:cursor-pointer transition duration-150 hover:scale-105 ${boxClassName}`}
      onClick={onClick}
    >
      <div>{userName}</div>
      <div className="flex justify-end my-3">
        <div className="text-sm font-extralight">
          {tab === 'all' && 'Date joined:'}
          {tab === 'applications' && 'Date created:'}&nbsp;
        </div>
        <div className="text-sm font-extralight">
          {getFormattedDate(dateCreated)}
        </div>
      </div>
    </div>
  )
}

export default PurpleBox
