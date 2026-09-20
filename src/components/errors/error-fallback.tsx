import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  onRetry?: () => void
}

export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex min-h-svh flex-col items-center justify-center gap-4"
    >
      <p className="text-destructive">載入錯誤，請稍後再試</p>
      <div className="flex gap-2">
        {onRetry && <Button onClick={onRetry}>重試</Button>}
        <Button variant="outline" asChild>
          <Link to="/">回首頁</Link>
        </Button>
      </div>
    </div>
  )
}
