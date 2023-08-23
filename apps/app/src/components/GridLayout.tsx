import { FC, ReactNode } from 'react'

/**
 * Properties of GridLayout components
 */
export interface GridLayoutProps {
  /**
   * React components wrapped by the component
   */
  children: ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that wraps a CSS grid layout
 */
export const GridLayout: FC<GridLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`container mx-auto max-w-screen-xl flex-grow py-8 px-0 sm:px-5 ${className}`}
    >
      <div className="grid grid-cols-12 lg:gap-8">{children}</div>
    </div>
  )
}

/**
 * Component that wraps a CSS grid component with a span of 4
 */
export const GridItemFour: FC<GridLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`lg:col-span-4 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Component that wraps a CSS grid component with a span of 6
 */
export const GridItemSix: FC<GridLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`lg:col-span-6 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Component that wraps a CSS grid component with a span of 8
 */
export const GridItemEight: FC<GridLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`lg:col-span-8 md:col-span-12 col-span-12 mb-5 ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Component that wraps a CSS grid component with a span of 12
 */
export const GridItemTwelve: FC<GridLayoutProps> = ({
  children,
  className = ''
}) => {
  return <div className={`col-span-12 ${className}`}>{children}</div>
}
