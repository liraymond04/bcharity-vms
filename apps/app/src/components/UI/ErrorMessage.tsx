import React, { FC } from 'react'

/**
 * Properties of {@link ErrorMessage}
 */
export interface ErrorMessageProps {
  /**
   * String of component title
   */
  title?: string
  /**
   * Error to display
   */
  error?: Error
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that displays a message component from an Error
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({
  title,
  error,
  className = ''
}) => {
  if (!error) return null

  return (
    <div
      className={`bg-red-50 dark:bg-red-900 dark:bg-opacity-10 border-2 border-red-500 border-opacity-50 p-4 space-y-1 rounded-xl ${className}`}
    >
      {title && (
        <h3
          className="text-sm font-medium text-red-800 dark:text-red-200"
          suppressHydrationWarning
        >
          {title}
        </h3>
      )}
      <div
        className="text-sm text-red-700 dark:text-red-200"
        suppressHydrationWarning
      >
        {error?.message}
      </div>
    </div>
  )
}
