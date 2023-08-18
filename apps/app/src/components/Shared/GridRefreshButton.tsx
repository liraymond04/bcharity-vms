import { RefreshIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'

import { Button } from '../UI/Button'

/**
 * Properties of {@link GridRefreshButton}
 */
export interface IGridRefreshButtonProps {
  /**
   * Function that runs when the button is clocked
   */
  onClick: VoidFunction
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that displays a button with a refresh icon
 *
 * This component does not implement the grid refresh functions,
 * it only calls a provided void function when its button is pressed
 *
 * @example {@link OrganizationVHR} component uses the GridRefreshButton
 * to call the `refetch()` method provided by the {@link usePostData}
 * hook with the onClick property
 * ```tsx
 * <GridRefreshButton onClick={refetch} className="ml-auto" />
 * ```
 */
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
