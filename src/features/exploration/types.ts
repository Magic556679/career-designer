import type { LucideIcon } from 'lucide-react'

export type Track = 'unsure' | 'dissatisfied' | 'direction'

export interface TrackOption {
  id: Track
  label: string
  icon: LucideIcon
}

export interface Question {
  id: string
  track: 'unsure' | 'dissatisfied' | 'direction' | null
  step: number
  title: string
  subtitle: string
  order: number
  maxSelections: number
}

export interface Option {
  id: string
  questionId: string
  icon: string
  title: string
  order: number
}

export interface Answer {
  questionId: string
  optionsId: string[]
  sessionId: string
}
