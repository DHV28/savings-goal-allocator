// Shown after the user confirms an income entry.
// Gives a clear summary of where the money went before going back to the dashboard.

import type { AllocationResult, IncomeEntry } from '../types'

interface Props {
  entry: IncomeEntry
  results: AllocationResult[]
  totalIncome: number
  onDone: () => void
}

export default function AllocationResultScreen({ entry, results, totalIncome, onDone }: Props) {
  // How much wasn't allocated to any goal
  const totalAllocated = results.reduce((sum, r) => sum + r.allocated, 0)
  const unallocated = parseFloat((totalIncome - totalAllocated).toFixed(2))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">🎉</p>
          <h2 className="text-gray-100 font-bold text-xl">Income Logged!</h2>
          <p className="text-gray-500 text-sm mt-1">
            RM{totalIncome.toLocaleString()} received
            {entry.note ? ` · ${entry.note}` : ''}
          </p>
        </div>

        {/* Allocation breakdown */}
        <div className="bg-[#12141e] rounded-xl p-4 flex flex-col gap-3 mb-6">
          <p className="text-xs text-gray-500 mb-1">Where it went</p>

          {results.map(r => (
            <div key={r.goalId} className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm font-medium">{r.goalName}</p>
                <p className="text-gray-500 text-xs">{r.allocationPercent}% of income</p>
              </div>
              <span className="text-[#86efac] font-semibold">+RM{r.allocated}</span>
            </div>
          ))}

          {/* Unallocated remainder */}
          {unallocated > 0 && (
            <div className="flex items-center justify-between border-t border-[#2a2d3a] pt-3">
              <div>
                <p className="text-gray-500 text-sm">Unallocated</p>
                <p className="text-gray-600 text-xs">Not assigned to any goal</p>
              </div>
              <span className="text-gray-500 font-semibold">RM{unallocated}</span>
            </div>
          )}
        </div>

        <button
          onClick={onDone}
          className="w-full bg-[#86efac] text-[#0f1117] font-semibold rounded-xl py-3 text-sm hover:bg-[#6ee7a0] transition-colors"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  )
}
