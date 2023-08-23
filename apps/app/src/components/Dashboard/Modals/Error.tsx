import React from 'react'

/**
 * Properties of {@link Error}
 */
export interface IErrorProps {
  /**
   * String of the error message
   */
  message: string
}

/**
 * Component that displays a styled error message. Used for displaying errors in modals
 */
const Error: React.FC<IErrorProps> = ({ message }) => {
  return (
    <div className="text-red-500 border-2 border-red-500 rounded-md mt-6">
      <p className="my-2 mx-4" suppressHydrationWarning>
        {message}
      </p>
    </div>
  )
}

export default Error
