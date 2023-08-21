import clsx from 'clsx'
import React, { FC } from 'react'

/**
 * Properties of {@link Slug}
 */
export interface SlugProps {
  /**
   * String of text to display
   */
  slug: string | undefined | null
  /**
   * String of prefix to add before the slug
   */
  prefix?: string
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * A component that renders a styled string used for slugs
 *
 * @example Slug used for an organiation's profile link in {@link components.Volunteers.VolunteerPage}
 * ```tsx
 * <div className="flex space-x-3 items-center">
 *   <Slug prefix="@" slug={opportunity.from.handle} />
 *   <FollowButton followId={opportunity.from.id} />
 * </div>
 * ```
 */
const Slug: FC<SlugProps> = ({ slug, prefix, className = '' }) => {
  return (
    <span
      className={clsx(
        className,
        'text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400 text-xs sm:text-sm'
      )}
    >
      {prefix}
      {slug}
    </span>
  )
}

export default Slug
