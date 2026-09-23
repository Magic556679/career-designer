import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-muted-foreground">找不到這個頁面</p>
      <Button asChild>
        <Link to="/">回首頁</Link>
      </Button>
    </main>
  )
}
