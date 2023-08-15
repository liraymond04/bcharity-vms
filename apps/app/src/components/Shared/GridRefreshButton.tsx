import { RefreshIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'

import { Button } from '../UI/Button'

interface IGridRefreshButtonProps {
  onClick: VoidFunction
  className?: string
}

const GridRefreshButton: React.FC<IGridRefreshButtonProps> = ({
  onClick,
  className
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.log-vhr'
  })
  return (
    <Button
      className={`ml-auto tooltip tooltip-primary ${className ?? ''}`}
      data-tip={t('refresh')}
      onClick={onClick}
    >
      <RefreshIcon className="w-4" />
    </Button>
  )
}

export default GridRefreshButton
