import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Track } from '@/features/exploration/types'

interface ExplorationState {
  track: Track | null
  setTrack: (track: Track) => void
  reset: () => void
}

export const useExplorationStore = create<ExplorationState>()(
  persist(
    (set) => ({
      track: null,
      setTrack: (newTrack: Track) => set({ track: newTrack }),
      reset: () => set({ track: null }),
    }),
    { name: 'exploration', storage: createJSONStorage(() => sessionStorage) },
  ),
)
