import { cn } from 'cn'
import { Loader2Icon } from 'lucide-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

function LoadingFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  )
}

export { Spinner, LoadingFallback }
