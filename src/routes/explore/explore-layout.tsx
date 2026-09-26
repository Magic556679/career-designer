import { Outlet, useMatches } from 'react-router-dom'

const TOTAL_STEPS = 4

type StepHandle = { step: number }

export default function ExploreLayout() {
  const match = useMatches()
  const matchLast = match.at(-1)

  return (
    <div className="flex min-h-svh justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-160">
        <header className="flex items-center justify-between px-6 py-4">
          <span className="text-[15px] font-semibold">Career Designer</span>
          <span className="text-[13px] text-muted-foreground">
            Step {matchLast ? (matchLast?.handle as StepHandle).step : 1}/{' '}
            {TOTAL_STEPS}
          </span>
        </header>

        <Outlet />

        <footer className="flex items-center justify-center px-6 pt-4 pb-6">
          <p className="text-xs text-muted-foreground">
            依你的選擇，我們會引導你一步步探索
          </p>
        </footer>
      </div>
    </div>
  )
}
