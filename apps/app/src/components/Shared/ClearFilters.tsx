import { FC } from 'react'

interface Props {
  onClick: Function
}

const ClearFilters: FC<Props> = ({ onClick }) => {
  return (
    <button
      className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:cursor-pointer dark:text-[#fff2f2] dark:text-opacity-80 dark:bg-[#555591] dark:border-[#20203f] dark:hover:text-opacity-100 dark:hover:text-[#ff8585]"
      onClick={() => {
        onClick()
      }}
    >
      Clear Filters
    </button>
  )
}

export default ClearFilters
