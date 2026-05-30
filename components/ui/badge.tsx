import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: Readonly<BadgeProps>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          'border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700': variant === 'default',
          'border-zinc-200 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700': variant === 'secondary',
          'border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700': variant === 'destructive',
          'text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800': variant === 'outline',
          'border-transparent bg-green-600 text-white shadow-sm hover:bg-green-700': variant === 'success',
          'border-transparent bg-yellow-600 text-white shadow-sm hover:bg-yellow-700': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
