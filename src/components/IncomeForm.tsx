// Form for logging a new income entry (salary, freelance, etc.)
// After submitting, it shows the AllocationResult so the user sees where their money went.

import { useState } from 'react'
import type { Goal, IncomeEntry, AllocationResult } from '../types'
import { allocateIncome, getTotalAllocated } from '../lib/allocation'

interface Props {
  goals: Goal[]
  onConfirm: (entry: IncomeEntry, results: AllocationResult[]) => void
  onCancel: () => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function IncomeForm({ goals, onConfirm, onCancel }: Props) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // default to today
  const [error, setError] = useState('')

  // Preview the split as the user types — updates live
  const parsedAmount = parseFloat(amount) || 0
  const preview = parsedAmount > 0 ? allocateIncome(parsedAmount, goals) : []
  const totalPercent = getTotalAllocated(goals)
  const unallocated = parsedAmount > 0
    ? parseFloat((parsedAmount * (1 - totalPercent / 100)).toFixed(2))
    : 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!amount || parsedAmount <= 0) return setError('Please enter a valid income amount.')
    if (goals.length === 0) return setError('Add at least one goal before logging income.')

    const entry: IncomeEntry = {
      id: generateId(),
      amount: parsedAmount,
      date,
      note: note.trim(),
    }

    onConfirm(entry, preview)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-gray-100 font-bold text-xl mb-6">Log Income</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Amount */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Amount received ($)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 3000"
              min="1"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Date received</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. August salary"
              className="w-full bg-[#12141e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-600 outline-none focus:border-[#86efac]/50 transition-colors"
            />
          </div>

          {/* Live allocation preview */}
          {preview.length > 0 && (
            <div className="bg-[#12141e] rounded-xl p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-500 mb-1">How this income will be split</p>
              {preview.map(r => (
                <div key={r.goalId} className="flex justify-between text-sm">
                  <span className="text-gray-300">{r.goalName}</span>
                  <span className="text-[#86efac] font-medium">+${r.allocated}</span>
                </div>
              ))}
              {/* Show how much is not allocated to any goal */}
              {unallocated > 0 && (
                <div className="flex justify-between text-sm border-t border-[#2a2d3a] pt-2 mt-1">
                  <span className="text-gray-500">Unallocated</span>
                  <span className="text-gray-500">${unallocated}</span>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-[#fca5a5] text-sm">{error}</p>}

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
              Confirm
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
