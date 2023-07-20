import React from 'react'

interface IDividerProps {
  className?: string
}

const Divider: React.FC<IDividerProps> = ({ className }) => {
  return (
    <div className={`${className} mx-auto my-2`}>
      <hr className=" border-zinc-400 dark:border-zinc-200" />
    </div>
  )
}

export default Divider
