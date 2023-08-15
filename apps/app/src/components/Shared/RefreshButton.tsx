import { RefreshIcon } from '@heroicons/react/outline'

import { Button } from '../UI/Button'

interface IGridRefreshButtonProps {
  onClick: VoidFunction
  className?: string
}

const GridRefreshButton: React.FC<IGridRefreshButtonProps> = ({
  onClick,
  className
}) => {
  return (
    <Button
      className={`ml-auto tooltip tooltip-primary ${className ?? ''}`}
      data-tip={'Refresh'}
      onClick={onClick}
    >
      <RefreshIcon className="w-4" />
    </Button>
  )
}

export default GridRefreshButton
