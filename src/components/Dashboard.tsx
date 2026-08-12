// The main screen — shows all goals, total allocation status, and action buttons.

import type { Goal } from '../types'
import { getTotalAllocated } from '../lib/allocation'
import GoalCard from './GoalCard'

interface Props {
  goals: Goal[]
  monthlyIncome: number
  onMonthlyIncomeChange: (amount: number) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (id: string) => void
  onLogIncome: () => void
}

export default function Dashboard({
  goals,
  monthlyIncome,
  onMonthlyIncomeChange,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onLogIncome,
}: Props) {
  const totalPercent = getTotalAllocated(goals)

  // Warn if percentages don't add up to 100
  const allocationWarning =
    goals.length > 0 && totalPercent !== 100
      ? totalPercent > 100
        ? `Over-allocated by ${totalPercent - 100}%`
        : `${100 - totalPercent}% of income unallocated`
      : null

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 px-4 py-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">Savings Goals</h1>
        <p className="text-gray-500 text-sm">Track where your money is going each month</p>
      </div>

      {/* Monthly income input — needed to calculate paces */}
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Typical monthly income</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={monthlyIncome || ''}
              onChange={e => onMonthlyIncomeChange(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 3000"
              className="bg-transparent text-gray-100 text-lg font-semibold outline-none w-full placeholder:text-gray-600"
            />
          </div>
        </div>
        <button
          onClick={onLogIncome}
          className="bg-[#86efac] text-[#0f1117] font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#6ee7a0] transition-colors whitespace-nowrap"
        >
          Log Income
        </button>
      </div>

      {/* Allocation warning */}
      {allocationWarning && (
        <div className="bg-[#fde68a]/10 border border-[#fde68a]/30 text-[#fde68a] text-sm rounded-xl px-4 py-3 mb-5">
          ⚠ {allocationWarning} — edit your goals to fix the split.
        </div>
      )}

      {/* Goal cards */}
      {goals.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-lg font-medium text-gray-400">No goals yet</p>
          <p className="text-sm mt-1">Add your first savings goal to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              monthlyIncome={monthlyIncome}
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Add goal button */}
      <button
        onClick={onAddGoal}
        className="w-full border-2 border-dashed border-[#2a2d3a] hover:border-[#86efac]/50 text-gray-500 hover:text-[#86efac] rounded-2xl py-4 text-sm font-medium transition-colors"
      >
        + Add Goal
      </button>

    </div>
  )
}
