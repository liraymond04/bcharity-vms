import React from 'react'

/**
 * Properties of {@link Divider}
 */
export interface IDividerProps {
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that displays a divider
 *
 * @example Example usage of the component
 * ```tsx
 * <Divider className="mt-5" />
 * ```
 */
const Divider: React.FC<IDividerProps> = ({ className }) => {
  return (
    <div className={`${className} mx-auto my-2`}>
      <hr className=" border-zinc-400 dark:border-zinc-200" />
    </div>
  )
}

export default Divider
