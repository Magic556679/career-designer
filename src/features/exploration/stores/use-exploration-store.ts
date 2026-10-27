import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { Track } from '@/features/exploration/types'

interface ExplorationState {
  track: Track | null
  optionKeys: Record<string, string[]>
  setTrack: (track: Track) => void
  setOptionKeys: (questionId: string, optionIds: string[]) => void
  reset: () => void
}

export const useExplorationStore = create<ExplorationState>()(
  devtools(
    persist(
      (set, get) => ({
        track: null,
        optionKeys: {},
        setTrack: (newTrack: Track) =>
          set({ track: newTrack }, undefined, 'exploration/setTrack'),
        setOptionKeys: (questionId: string, optionIds: string[]) =>
          set(
            { optionKeys: { ...get().optionKeys, [questionId]: optionIds } },
            undefined,
            'exploration/setOptionKeys',
          ),
        reset: () =>
          set({ track: null, optionKeys: {} }, undefined, 'exploration/reset'),
      }),
      { name: 'exploration', storage: createJSONStorage(() => sessionStorage) },
    ),
    { name: 'ExplorationStore', enabled: import.meta.env.DEV },
  ),
)
