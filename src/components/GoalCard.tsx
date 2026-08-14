// A single goal card shown on the dashboard.
// Displays progress, status badge, monthly pace info, and edit/delete buttons.

import type { Goal } from '../types'
import { getGoalProgress } from '../lib/goalProgress'

interface Props {
  goal: Goal
  monthlyIncome: number
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
}

// Each status gets its own colour so the user can tell at a glance
const statusStyles = {
  'on-track': { label: 'On Track', className: 'text-[#86efac] bg-[#86efac]/10 border-[#86efac]/30' },
  'behind':   { label: 'Behind',   className: 'text-[#fde68a] bg-[#fde68a]/10 border-[#fde68a]/30' },
  'reached':  { label: 'Reached!', className: 'text-[#c4b5fd] bg-[#c4b5fd]/10 border-[#c4b5fd]/30' },
  'expired':  { label: 'Expired',  className: 'text-[#fca5a5] bg-[#fca5a5]/10 border-[#fca5a5]/30' },
}

export default function GoalCard({ goal, monthlyIncome, onEdit, onDelete }: Props) {
  const progress = getGoalProgress(goal, monthlyIncome)
  const percentSaved = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const { label, className } = statusStyles[progress.status]

  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-5 flex flex-col gap-4">

      {/* Goal name + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Colour dot — each goal has a pastel colour picked by the user */}
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
          <h3 className="text-gray-100 font-semibold text-base">{goal.name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${className}`}>
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-200 mb-1">
          <span>RM{goal.currentAmount.toLocaleString()} saved</span>
          <span>of RM{goal.targetAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-[#2a2d3a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentSaved}%`, backgroundColor: goal.color }}
          />
        </div>
        <p className="text-xs text-gray-200 mt-1 text-right">{percentSaved.toFixed(1)}% complete</p>
      </div>

      {/* Monthly pace info — only shown when goal is still active */}
      {progress.status !== 'reached' && progress.status !== 'expired' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#12141e] rounded-xl p-3">
            <p className="text-gray-300 text-xs mb-1">Need / month</p>
            <p className="text-white font-medium text-sm">
              {progress.requiredPerMonth === Infinity ? '—' : `RM${progress.requiredPerMonth}`}
            </p>
          </div>
          <div className="bg-[#12141e] rounded-xl p-3">
            <p className="text-gray-300 text-xs mb-1">Getting / month</p>
            <p className="text-[#86efac] font-medium text-sm">RM{progress.projectedPerMonth}</p>
          </div>
        </div>
      )}

      {/* Footer — allocation info + edit/delete */}
      <div className="flex items-center justify-between text-xs text-gray-300">
        <span>{goal.allocationPercent}% of income · {progress.monthsLeft}mo left</span>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(goal)}
            className="text-[#93c5fd] hover:text-blue-300 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-[#fca5a5] hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

    </div>
  )
}
