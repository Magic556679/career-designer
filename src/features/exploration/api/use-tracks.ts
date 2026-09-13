import { useQuery } from '@tanstack/react-query'
import { Frown, RefreshCw, Rocket } from 'lucide-react'
import type { TrackOption } from '@/features/exploration/types'

const MOCK_TRACK: TrackOption[] = [
  { id: 'unsure', icon: Frown, label: '我不知道自己適合什麼工作' },
  {
    id: 'dissatisfied',
    icon: RefreshCw,
    label: '我不喜歡現在的工作，想找其他可能',
  },
  { id: 'direction', icon: Rocket, label: '我想找到更適合自己的職涯方向' },
]

export function useTracks() {
  return useQuery({
    queryKey: ['exploration', 'track'],
    queryFn: async () => MOCK_TRACK,
  })
}
