import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  useTracks,
  useExplorationStore,
  type Track,
} from '@/features/exploration'

export default function Step1() {
  const navigate = useNavigate()
  const setTrack = useExplorationStore((s) => s.setTrack)
  const { data: tracks, isPending, isError } = useTracks()

  const handleSelect = (track: Track) => {
    setTrack(track)
    navigate('/explore/step-2')
  }

  if (isPending) {
    return <div>載入中...</div>
  }

  if (isError) {
    return <div>載入錯誤...</div>
  }

  return (
    <div className="flex min-h-svh justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-160">
        <header className="flex items-center justify-between px-6 py-4">
          <span className="text-[15px] font-semibold">Career Designer</span>
          <span className="text-[13px] text-muted-foreground">Step 1 / 4</span>
        </header>

        <div className="flex flex-col gap-6 px-6 pt-8 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-bold">認識自己</h1>
            <p className="text-[15px] text-muted-foreground">
              你現在比較接近哪種狀態？
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {tracks.map((track) => (
              <Card
                key={track.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(track.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(track.id)
                  }
                }}
                className="cursor-pointer bg-background py-0 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CardContent className="flex items-center gap-3.5 px-5 py-4">
                  <track.icon className="size-6 shrink-0" />
                  <span className="font-medium">{track.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-center px-6 pt-4 pb-6">
          <p className="text-xs text-muted-foreground">
            選擇最接近你的狀態，我們會引導你一步步探索
          </p>
        </footer>
      </div>
    </div>
  )
}
