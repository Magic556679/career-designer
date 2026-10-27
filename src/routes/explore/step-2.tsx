import ErrorFallback from '@/components/errors/error-fallback'
import { LoadingFallback } from '@/components/ui/spinner'
import MultiSelectCards from '@/features/exploration/components/multi-select-cards'
import { useQuestions, useExplorationStore } from '@/features/exploration'

const EMPTY_SELECTED_IDS: string[] = []

export default function Step2() {
  const { data: question, isPending, isError, refetch } = useQuestions('unsure')

  const selectedIds = useExplorationStore(
    (state) =>
      state.optionKeys[question?.questionId ?? ''] ?? EMPTY_SELECTED_IDS,
  )
  const setOptionKeys = useExplorationStore((state) => state.setOptionKeys)

  if (isPending) {
    return <LoadingFallback />
  }

  if (isError) {
    return <ErrorFallback onRetry={() => refetch()} />
  }

  return (
    <div className="flex flex-col gap-2 px-6 pt-8 pb-6">
      <MultiSelectCards
        maxSelections={question.maxSelections}
        options={question.options}
        selectedIds={selectedIds}
        onChange={(optionIds) => setOptionKeys(question.questionId, optionIds)}
      />
    </div>
  )
}
