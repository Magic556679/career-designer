import type { LucideIcon } from 'lucide-react'

export type Track = 'unsure' | 'dissatisfied' | 'direction'

export interface TrackOption {
  id: Track
  label: string
  icon: LucideIcon
}
