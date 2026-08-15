// The main screen — shows all goals, warnings, and action buttons.

import { useState } from 'react'
import type { Goal } from '../types'
import { getTotalAllocated } from '../lib/allocation'
import { getGoalProgress } from '../lib/goalProgress'
import GoalCard from './GoalCard'

interface Props {
  goals: Goal[]
  monthlyIncome: number
  unallocatedPool: number  // money from past income entries not yet assigned to any goal
  onMonthlyIncomeChange: (amount: number) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (id: string) => void
  onLogIncome: () => void
}

export default function Dashboard({
  goals,
  monthlyIncome,
  unallocatedPool,
  onMonthlyIncomeChange,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onLogIncome,
}: Props) {
  const [showDone, setShowDone] = useState(false)
  const totalPercent = getTotalAllocated(goals)

  // Split goals into active vs done (reached or expired) — done ones are hidden by default
  const activeGoals = goals.filter(g => {
    const { status } = getGoalProgress(g, monthlyIncome)
    return status !== 'reached' && status !== 'expired'
  })
  const doneGoals = goals.filter(g => {
    const { status } = getGoalProgress(g, monthlyIncome)
    return status === 'reached' || status === 'expired'
  })

  const allocationWarning =
    goals.length > 0 && totalPercent !== 100
      ? totalPercent > 100
        ? `Over-allocated by ${totalPercent - 100}%`
        : `${100 - totalPercent}% unallocated`
      : null

  // Goals where current monthly allocation won't hit the target in time
  const goalsAtRisk = goals.filter(goal => {
    const { status } = getGoalProgress(goal, monthlyIncome)
    return status === 'behind'
  })

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 px-6 py-10 max-w-5xl mx-auto">

      {/* Header row — title + actions */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Savings Goals</h1>
          <p className="text-gray-300 text-sm mt-0.5">Track where your money goes each month</p>
        </div>
        <button
          onClick={onLogIncome}
          className="bg-[#86efac] text-[#0f1117] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#6ee7a0] transition-colors"
        >
          + Log Income
        </button>
      </div>

      {/* Monthly income — shown inline, labelled clearly as what drives the pace calculations */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gray-200 text-sm">Monthly income used for calculations:</span>
        <div className="flex items-center gap-1 bg-[#1a1d27] border border-[#2a2d3a] rounded-xl px-3 py-1.5">
          <span className="text-gray-200 text-sm">RM</span>
          <input
            type="number"
            value={monthlyIncome || ''}
            onChange={e => onMonthlyIncomeChange(parseFloat(e.target.value) || 0)}
            placeholder="3000"
            className="bg-transparent text-white text-sm font-semibold outline-none w-24 placeholder:text-gray-600"
          />
        </div>
        {allocationWarning && (
          <span className="text-[#fde68a] text-sm">⚠ {allocationWarning}</span>
        )}
      </div>

      {/* General savings balance — money not assigned to any goal accumulates here */}
      {unallocatedPool > 0 && (
        <div className="bg-[#1a1d27] border border-[#86efac]/20 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-300 mb-1 font-medium tracking-wide">General Savings</p>
            <p className="text-[#86efac] text-xl font-bold">RM{unallocatedPool.toLocaleString()}</p>
            <p className="text-xs text-gray-300 mt-1">Unallocated income — assigned to your next new goal</p>
          </div>
          <button
            onClick={onAddGoal}
            className="text-xs text-[#86efac] border border-[#86efac]/30 px-3 py-1.5 rounded-xl hover:bg-[#86efac]/10 transition-colors"
          >
            + Add Goal
          </button>
        </div>
      )}

      {/* Goals at risk — only shown when there's a problem worth flagging */}
      {goalsAtRisk.length > 0 && monthlyIncome > 0 && (
        <div className="border border-[#fca5a5]/20 bg-[#fca5a5]/5 rounded-2xl px-5 py-4 mb-6">
          <p className="text-[#fca5a5] text-sm font-semibold mb-3">
            {goalsAtRisk.length} goal{goalsAtRisk.length > 1 ? 's' : ''} won't be reached in time
          </p>
          <div className="flex flex-col gap-2">
            {goalsAtRisk.map(goal => {
              const { requiredPerMonth, projectedPerMonth } = getGoalProgress(goal, monthlyIncome)
              const shortfall = parseFloat((requiredPerMonth - projectedPerMonth).toFixed(2))
              return (
                <div key={goal.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
                    <span className="text-gray-300">{goal.name}</span>
                  </div>
                  <span className="text-gray-300 text-xs">
                    {isFinite(shortfall) ? `RM${shortfall} short per month` : 'Cannot reach in time'} —{' '}
                    <button onClick={() => onEditGoal(goal)} className="text-[#93c5fd] hover:underline">
                      fix it
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active goal cards */}
      {activeGoals.length === 0 && doneGoals.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-lg font-medium text-gray-200">No goals yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first savings goal to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {activeGoals.map(goal => (
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

      {/* Completed & expired goals — collapsed by default */}
      {doneGoals.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2a2d3a]" />
            <button
              onClick={() => setShowDone(prev => !prev)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors font-medium"
            >
              <span>{showDone ? '▾' : '▸'}</span>
              <span>Completed & Expired ({doneGoals.length})</span>
            </button>
            <div className="flex-1 h-px bg-[#2a2d3a]" />
          </div>
          {showDone && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doneGoals.map(goal => (
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
        </div>
      )}

      {/* Add goal */}
      <button
        onClick={onAddGoal}
        className="w-full border-2 border-dashed border-[#2a2d3a] hover:border-[#86efac]/40 text-gray-400 hover:text-[#86efac] rounded-2xl py-4 text-sm font-medium transition-colors"
      >
        + Add Goal
      </button>

    </div>
  )
}
