import React from 'react'

/**
 * Properties of {@link GradientWrapper}
 */
export interface IGradientWrapperProps {
  /**
   * React components wrapped by the component
   */
  children: React.ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * A component that wraps its children in a gradient background
 *
 * @example Add a gradient background to main body content in {@link SiteLayout}
 * ```tsx
 * <GradientWrapper className="grow">
 *   ...
 *   {children}
 * </GradientWrapper>
 * ```
 */

// rgba(242, 241, 241, 1) base
// rgba(206, 187, 248, 0.16) top right
// rgba(229, 214, 238, 0.4) left
// rgba(223, 230, 254, 0.72) bottom

const GradientWrapper: React.FC<IGradientWrapperProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`gradient dark:darkgradient ${className}`}>{children}</div>
  )
}

export default GradientWrapper
