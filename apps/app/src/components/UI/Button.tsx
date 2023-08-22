import clsx from 'clsx'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode
} from 'react'

/**
 * Properties of {@link Button} that extends an HTML button element
 */
export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  /**
   * size of the button to render
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Type of button style to render
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'super' | 'danger'
  /**
   * Boolean of whether to render outline
   */
  outline?: boolean
  /**
   * Boolean of whether to render shadows
   */
  light?: boolean
  /**
   * Disables button if true
   */
  loading?: boolean
  /**
   * Component to display as butotn icon
   */
  icon?: ReactNode
  /**
   * React components wrapped by the component
   */
  children?: ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that displays a styled button. Wraps a default HTML button
 * component and extends its props.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = '',
      size = 'md',
      variant = 'primary',
      outline,
      light,
      loading,
      icon,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={clsx(
          {
            'bg-brand-500 hover:bg-brand-600 border border-brand-600 text-white focus:ring-brand-400':
              !outline && !light && variant === 'primary',
            'bg-gray-500 hover:bg-gray-600 border border-gray-600 text-white focus:ring-gray-400':
              !outline && !light && variant === 'secondary',
            'bg-green-500 hover:bg-green-400 border border-green-600 text-white focus:ring-green-400':
              !outline && !light && variant === 'success',
            'bg-yellow-500 hover:bg-yellow-400 border border-yellow-600 text-white focus:ring-yellow-400':
              !outline && !light && variant === 'warning',
            'bg-pink-500 hover:bg-pink-400 border border-pink-600 text-white focus:ring-pink-400':
              !outline && !light && variant === 'super',
            'bg-red-500 hover:bg-red-400 border border-red-600 text-white focus:ring-red-400':
              !outline && !light && variant === 'danger',
            'border border-brand-500 text-brand hover:bg-brand-100 focus:ring-brand-400':
              outline && !light && variant === 'primary',
            'border border-gray-500 text-gray-500 hover:bg-gray-100 focus:ring-gray-400':
              outline && !light && variant === 'secondary',
            'border border-green-500 text-green-500 hover:bg-green-100 focus:ring-green-400':
              outline && !light && variant === 'success',
            'border border-yellow-500 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-400':
              outline && !light && variant === 'warning',
            'border border-pink-500 text-pink-500 hover:bg-pink-100 focus:ring-pink-400':
              outline && !light && variant === 'super',
            'border border-red-500 text-red-500 hover:bg-red-100 focus:ring-red-400':
              outline && !light && variant === 'danger',
            'border-none !shadow-none text-gray-500': light,
            'px-2 py-0.5': size === 'sm',
            'px-3 py-1': size === 'md',
            'px-4 py-1.5': size === 'lg',
            'flex items-center space-x-1.5': icon && children
          },
          'rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none',
          className
        )}
        disabled={loading}
        {...rest}
      >
        <div className="pointer-events-none">{icon}</div>
        <div className="pointer-events-none" suppressHydrationWarning>
          {children}
        </div>
      </button>
    )
  }
)
