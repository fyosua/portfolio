import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary
          disabled:opacity-50 disabled:pointer-events-none
          ${
            variant === 'default'
              ? 'bg-primary text-white hover:bg-secondary'
              : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${
            size === 'default'
              ? 'h-10 py-2 px-4'
              : 'h-10 w-10'
          }
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
