import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
  variant: 'table' | 'card'
  rows?: number
}

export function LoadingState({ variant, rows = 4 }: LoadingStateProps) {
  if (variant === 'card') {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/6" />
        <Skeleton className="h-8 w-1/6" />
        <Skeleton className="h-8 w-1/6" />
        <Skeleton className="h-8 w-1/5" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
