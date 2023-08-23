import { MouseEventHandler } from 'react'

interface PurpleBoxProps {
  selected?: boolean
  userName: string
  dateCreated: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

const PurpleBox: React.FC<PurpleBoxProps> = ({
  selected,
  userName,
  dateCreated,
  onClick
}) => {
  const boxClassName = selected
    ? 'bg-blue-100 dark:bg-violet-500'
    : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
  return (
    <div
      className={`items-center shadow-sm shadow-black px-5 mx-5 my-3 h-16 py-2 ${boxClassName}`}
      onClick={onClick}
    >
      <div>{userName}</div>
      <div className="flex justify-end my-3">
        <div className="text-sm font-extralight">
          Application date created:&nbsp;
        </div>
        <div className="text-sm font-extralight">{dateCreated}</div>
      </div>
    </div>
  )
}

export default PurpleBox
