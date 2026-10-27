import { icons } from 'lucide-react'
import type { Option } from '@/features/exploration/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface MultiSelectCardsProps {
  maxSelections: number
  options: Option[]
  selectedIds: string[]
  onChange: (optionIds: string[]) => void
}

export default function MultiSelectCards({
  maxSelections,
  options,
  selectedIds,
  onChange,
}: MultiSelectCardsProps) {
  function handleToggle(optionId: string) {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((item) => item !== optionId))
    } else if (selectedIds.length < maxSelections) {
      onChange([...selectedIds, optionId])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const Icon = icons[option.icon as keyof typeof icons]
        const selected = selectedIds.includes(option.id)
        return (
          <Button
            key={option.id}
            variant="outline"
            aria-pressed={selected}
            type="button"
            onClick={() => handleToggle(option.id)}
            className={cn(
              'h-auto cursor-pointer justify-start gap-2 px-4 py-3 whitespace-normal',
              selected && 'border-primary ring-1 ring-primary',
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.title}
          </Button>
        )
      })}
    </div>
  )
}
