import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/10',
        outline: 'border border-border bg-transparent text-white hover:bg-white/10',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-dark',
      },
      size: {
        default: 'px-6 py-3 text-sm',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-7 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, asChild = false, ...rest } = props
  const Comp = asChild ? Slot : 'button'

  return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...rest} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
