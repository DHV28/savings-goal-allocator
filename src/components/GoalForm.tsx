// Form for adding a new goal or editing an existing one.
// Opens as a full-screen overlay on top of the dashboard.

import { useState } from 'react'
import type { Goal } from '../types'

interface Props {
  existingGoal?: Goal  // if passed in, we're editing — otherwise adding
  onSave: (goal: Goal) => void
  onCancel: () => void
}

// A few pastel colour options for the user to pick from
const COLOUR_OPTIONS = [
  '#86efac', // pastel green
  '#93c5fd', // pastel blue
  '#c4b5fd', // pastel purple
  '#fde68a', // pastel yellow
  '#fca5a5', // pastel red/pink
  '#6ee7b7', // pastel teal
]

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GoalForm({ existingGoal, onSave, onCancel }: Props) {
  // Pre-fill fields if editing, otherwise start blank
  const [name, setName] = useState(existingGoal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(existingGoal?.targetAmount?.toString() ?? '')
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.currentAmount?.toString() ?? '0')
  const [deadline, setDeadline] = useState(existingGoal?.deadline ?? '')
  const [allocationPercent, setAllocationPercent] = useState(existingGoal?.allocationPercent?.toString() ?? '')
  const [color, setColor] = useState(existingGoal?.color ?? COLOUR_OPTIONS[0])
  const [error, setError] = useState('')

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
            <label className="text-xs text-gray-400 mb-1 block">Target amount ($)</label>
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
            <label className="text-xs text-gray-400 mb-1 block">Already saved ($)</label>
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
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Allocation % */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              % of each paycheck to put here
            </label>
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
