// Form for adding a new goal or editing an existing one.
// Opens as a full-screen overlay on top of the dashboard.

import { useState } from 'react'
import { differenceInMonths, parseISO, isAfter } from 'date-fns'
import type { Goal } from '../types'

interface Props {
  existingGoal?: Goal      // if passed in, we're editing — otherwise adding
  defaultAllocationPercent?: number  // pre-filled with remaining unallocated % when adding
  unallocatedPool?: number           // money sitting unallocated from past income entries
  monthlyIncome?: number             // needed to calculate the suggested allocation %
  onSave: (goal: Goal) => void
  onCancel: () => void
}

// A few pastel colour options for the user to pick from
const COLOUR_OPTIONS = [
  '#86efac', // pastel green
  '#93c5fd', // pastel blue
  '#c4b5fd', // pastel purple
  '#fde68a', // pastel yellow
  '#fca5a5', // pastel pink
  '#fdba74', // pastel orange
]

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GoalForm({ existingGoal, defaultAllocationPercent, unallocatedPool = 0, monthlyIncome = 0, onSave, onCancel }: Props) {
  // Pre-fill fields if editing, otherwise start blank (allocation % defaults to remaining unallocated)
  const [name, setName] = useState(existingGoal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(existingGoal?.targetAmount?.toString() ?? '')
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.currentAmount?.toString() ?? '0')
  const [deadline, setDeadline] = useState(existingGoal?.deadline ?? '')
  const [allocationPercent, setAllocationPercent] = useState(
    existingGoal?.allocationPercent?.toString() ?? defaultAllocationPercent?.toString() ?? ''
  )
  const [color, setColor] = useState(existingGoal?.color ?? COLOUR_OPTIONS[0])
  const [error, setError] = useState('')

  // Calculates the minimum % of monthly income needed to hit this goal by the deadline.
  // Only works if target, current amount, deadline, and monthly income are all filled in.
  function suggestAllocation() {
    const target = parseFloat(targetAmount)
    const current = parseFloat(currentAmount) || 0
    const remaining = target - current

    if (!deadline || !target || monthlyIncome <= 0 || remaining <= 0) return

    const deadlineDate = parseISO(deadline)
    const today = new Date()

    if (!isAfter(deadlineDate, today)) return

    const months = differenceInMonths(deadlineDate, today)
    if (months <= 0) return

    const neededPerMonth = remaining / months
    const suggestedPercent = Math.ceil((neededPerMonth / monthlyIncome) * 100)

    // Cap at 100 so we don't suggest something impossible
    setAllocationPercent(Math.min(suggestedPercent, 100).toString())
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!name.trim()) return setError('Please enter a goal name.')
    if (!targetAmount || parseFloat(targetAmount) <= 0) return setError('Target amount must be greater than 0.')
    if (!deadline) return setError('Please pick a deadline.')
    if (!allocationPercent || parseFloat(allocationPercent) < 0 || parseFloat(allocationPercent) > 100)
      return setError('Allocation must be between 0 and 100.')

    const goal: Goal = {
      id: existingGoal?.id ?? generateId(),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      allocationPercent: parseFloat(allocationPercent),
      color,
    }

    onSave(goal)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-gray-100 font-bold text-xl mb-6">
          {existingGoal ? 'Edit Goal' : 'New Goal'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Goal name */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Goal name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Emergency Fund"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Target amount */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Target amount (RM)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Already saved */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Already saved (RM)</label>
            <input
              type="number"
              value={currentAmount}
              onChange={e => setCurrentAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Allocation % — with a suggest button that calculates the minimum needed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">% of each paycheck to put here</label>
              {monthlyIncome > 0 && (
                <button
                  type="button"
                  onClick={suggestAllocation}
                  className="text-xs text-[#93c5fd] hover:underline"
                >
                  Suggest % for me
                </button>
              )}
            </div>
            <input
              type="number"
              value={allocationPercent}
              onChange={e => setAllocationPercent(e.target.value)}
              placeholder="e.g. 20"
              min="0"
              max="100"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Colour picker */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Colour</label>
            <div className="flex gap-3">
              {COLOUR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Show the user that their unallocated pool will be applied to this goal */}
          {unallocatedPool > 0 && (
            <div className="bg-[#86efac]/10 border border-[#86efac]/20 rounded-xl px-4 py-3 text-sm text-[#86efac]">
              💰 RM{unallocatedPool} from past unallocated income will be added to this goal automatically.
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-[#fca5a5] text-sm">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-[#2a2d3a] text-gray-400 hover:text-gray-200 rounded-xl py-3 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#86efac] text-[#0f1117] font-semibold rounded-xl py-3 text-sm hover:bg-[#6ee7a0] transition-colors"
            >
              {existingGoal ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
