import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md h-6 px-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary-container text-on-secondary-container rounded-full',
        outline: 'text-foreground border border-outline-variant/20',
        success: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white',
        warning: 'bg-amber-500 text-white dark:bg-amber-500 dark:text-white',
        destructive: 'bg-red-600 text-white dark:bg-red-500 dark:text-white',
        info: 'bg-sky-600 text-white dark:bg-sky-500 dark:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
