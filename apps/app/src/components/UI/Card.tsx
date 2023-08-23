import clsx from 'clsx'
import { FC, MouseEvent, ReactNode } from 'react'

/**
 * Properties of {@link CardProps}
 */
export interface CardProps {
  /**
   * React components wrapped by the component
   */
  children: ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
  /**
   * Whether to force card component to be rounded
   */
  forceRounded?: boolean
  /**
   * ID property to use for testing libraries
   */
  testId?: string
  /**
   * Function that runs when the component is clicked
   * @param event
   * @returns
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
}

/**
 * Component that displays its children in a styled Card component
 */
export const Card: FC<CardProps> = ({
  children,
  className = '',
  forceRounded = false,
  testId = '',
  onClick
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // Prevent click propagation if the target is a button
    const et = event.target as HTMLInputElement
    if (et.tagName === 'BUTTON') {
      event.stopPropagation()
    } else if (onClick) {
      onClick(event)
    }
  }

  return (
    <div
      className={clsx(
        forceRounded ? 'rounded-xl' : 'rounded-none sm:rounded-xl',
        'border dark:border-gray-700/80 bg-secondary-content dark:bg-Card drop-shadow-md',
        className
      )}
      data-test={testId}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader: FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return <div className={`border-b p-3 ${className}`}>{children}</div>
}

interface CardBodyProps {
  children?: ReactNode
  className?: string
}
export const CardBody: FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>
}
