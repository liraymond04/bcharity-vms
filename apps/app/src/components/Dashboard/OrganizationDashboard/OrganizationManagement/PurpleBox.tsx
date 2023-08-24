import { MouseEventHandler } from 'react'

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
  const fillZero = (n: number, w: number) => {
    let str = String(n)
    for (let i = str.length; i < w; i++) {
      str = '0' + str
    }
    return str
  }

  const date = new Date(dateCreated)
  const day = fillZero(date.getDay(), 2)
  const month = fillZero(date.getMonth(), 2)
  const year = fillZero(date.getFullYear(), 2)

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
          {`${year}-${month}-${day}`}
        </div>
      </div>
    </div>
  )
}

export default PurpleBox
