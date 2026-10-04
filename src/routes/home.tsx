import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">career-designer</h1>
      <Button onClick={() => navigate('/explore/step-1')}>Get Started</Button>
    </main>
  )
}

export default Home
