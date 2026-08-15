// App.tsx — the root component. Holds all state and decides which screen to show.
// There's no router here — just a simple "view" string that switches between screens.

import { useState } from 'react'
import type { Goal, IncomeEntry, AllocationResult } from './types'
import { loadGoals, saveGoals, loadIncome, saveIncome, loadUnallocatedPool, saveUnallocatedPool } from './lib/storage'
import { getTotalAllocated } from './lib/allocation' // used for remainingPercent below
import Dashboard from './components/Dashboard'
import GoalForm from './components/GoalForm'
import IncomeForm from './components/IncomeForm'
import AllocationResultScreen from './components/AllocationResult'

// All the screens the app can be on
type View = 'dashboard' | 'add-goal' | 'edit-goal' | 'log-income' | 'allocation-result'

function loadMonthlyIncome(): number {
  return parseFloat(localStorage.getItem('monthlyIncome') ?? '0') || 0
}

function App() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals)
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(loadIncome)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(loadMonthlyIncome)
  const [unallocatedPool, setUnallocatedPool] = useState<number>(loadUnallocatedPool)
  const [view, setView] = useState<View>('dashboard')
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)

  // Stores the last logged income + its split so AllocationResult can display it
  const [lastEntry, setLastEntry] = useState<IncomeEntry | null>(null)
  const [lastResults, setLastResults] = useState<AllocationResult[]>([])

  function handleMonthlyIncomeChange(amount: number) {
    setMonthlyIncome(amount)
    localStorage.setItem('monthlyIncome', String(amount))
  }

  function handleSaveGoal(goal: Goal) {
    let finalGoal = goal

    // When adding a new goal, automatically apply the unallocated pool to its current savings
    if (!goalToEdit && unallocatedPool > 0) {
      const needed = goal.targetAmount - goal.currentAmount
      const toApply = parseFloat(Math.min(unallocatedPool, needed).toFixed(2))
      const leftover = parseFloat((unallocatedPool - toApply).toFixed(2))
      finalGoal = {
        ...goal,
        currentAmount: parseFloat((goal.currentAmount + toApply).toFixed(2)),
      }
      setUnallocatedPool(leftover)
      saveUnallocatedPool(leftover)
    }

    const updated = goalToEdit
      ? goals.map(g => g.id === goal.id ? goal : g)  // replace existing goal
      : [...goals, finalGoal]                          // append new goal with pool applied
    setGoals(updated)
    saveGoals(updated)
    setView('dashboard')
    setGoalToEdit(null)
  }

  function handleDeleteGoal(id: string) {
    const updated = goals.filter(g => g.id !== id)
    setGoals(updated)
    saveGoals(updated)
  }

  function handleEditGoal(goal: Goal) {
    setGoalToEdit(goal)
    setView('edit-goal')
  }

  function handleCancel() {
    setView('dashboard')
    setGoalToEdit(null)
  }

  // When the user confirms income: save it, update goal amounts, stash leftover in pool
  function handleConfirmIncome(entry: IncomeEntry, results: AllocationResult[]) {
    const updatedEntries = [...incomeEntries, entry]
    setIncomeEntries(updatedEntries)
    saveIncome(updatedEntries)

    // Add the allocated amount to each goal's current savings
    const updatedGoals = goals.map(goal => {
      const result = results.find(r => r.goalId === goal.id)
      if (!result) return goal
      return { ...goal, currentAmount: parseFloat((goal.currentAmount + result.allocated).toFixed(2)) }
    })
    setGoals(updatedGoals)
    saveGoals(updatedGoals)

    // Any income not allocated to a goal goes into the unallocated pool
    const totalActuallyAllocated = results.reduce((sum, r) => sum + r.allocated, 0)
    const leftover = parseFloat((entry.amount - totalActuallyAllocated).toFixed(2))
    if (leftover > 0) {
      const newPool = parseFloat((unallocatedPool + leftover).toFixed(2))
      setUnallocatedPool(newPool)
      saveUnallocatedPool(newPool)
    }

    setLastEntry(entry)
    setLastResults(results)
    setView('allocation-result')
  }

  // How much % is still unallocated — pre-filled in GoalForm when adding a new goal
  const remainingPercent = Math.max(0, 100 - getTotalAllocated(goals))

  return (
    <>
      {/* Dashboard is always rendered in the background */}
      <Dashboard
        goals={goals}
        monthlyIncome={monthlyIncome}
        unallocatedPool={unallocatedPool}
        onMonthlyIncomeChange={handleMonthlyIncomeChange}
        onAddGoal={() => setView('add-goal')}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal}
        onLogIncome={() => setView('log-income')}
      />

      {/* GoalForm — pre-fills allocation % with remaining unallocated % when adding */}
      {(view === 'add-goal' || view === 'edit-goal') && (
        <GoalForm
          key={view === 'edit-goal' ? goalToEdit?.id : 'new'}
          existingGoal={goalToEdit ?? undefined}
          defaultAllocationPercent={goalToEdit ? undefined : remainingPercent}
          unallocatedPool={goalToEdit ? 0 : unallocatedPool}
          monthlyIncome={monthlyIncome}
          onSave={handleSaveGoal}
          onCancel={handleCancel}
        />
      )}

      {/* IncomeForm opens when the user clicks "Log Income" */}
      {view === 'log-income' && (
        <IncomeForm
          goals={goals}
          onConfirm={handleConfirmIncome}
          onCancel={handleCancel}
        />
      )}

      {/* AllocationResult shows after income is confirmed */}
      {view === 'allocation-result' && lastEntry && (
        <AllocationResultScreen
          entry={lastEntry}
          results={lastResults}
          totalIncome={lastEntry.amount}
          onDone={() => setView('dashboard')}
        />
      )}
    </>
  )
}

export default App
