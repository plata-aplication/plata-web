import * as React from 'react'

import { cn } from '@/shared/lib/cn'
import { Label } from './label'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const errorExist = (error?.length ?? 0) > 0
    return (
      <div>
        <Label className={cn('text-gray-500', errorExist && 'text-red-500')}>
          {label}
        </Label>
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-lg bg-input px-6 py-4 text-sm ring-offset-background file:border-0',
            'file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {errorExist && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
