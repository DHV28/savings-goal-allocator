// App.tsx — the root component. Holds all state and decides which screen to show.
// There's no router here — just a simple "view" string that switches between screens.

import { useState } from 'react'
import type { Goal } from './types'
import { loadGoals, saveGoals } from './lib/storage'
import Dashboard from './components/Dashboard'
import GoalForm from './components/GoalForm'

// The three screens the app can be on
type View = 'dashboard' | 'add-goal' | 'edit-goal'

function loadMonthlyIncome(): number {
  return parseFloat(localStorage.getItem('monthlyIncome') ?? '0') || 0
}

function App() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(loadMonthlyIncome)
  const [view, setView] = useState<View>('dashboard')
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)

  function handleMonthlyIncomeChange(amount: number) {
    setMonthlyIncome(amount)
    localStorage.setItem('monthlyIncome', String(amount))
  }

  function handleSaveGoal(goal: Goal) {
    const updated = goalToEdit
      ? goals.map(g => g.id === goal.id ? goal : g)  // replace existing goal
      : [...goals, goal]                               // append new goal
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

  // Placeholder — IncomeForm is the next component to be built
  function handleLogIncome() {}

  return (
    <>
      {/* Dashboard is always rendered in the background */}
      <Dashboard
        goals={goals}
        monthlyIncome={monthlyIncome}
        onMonthlyIncomeChange={handleMonthlyIncomeChange}
        onAddGoal={() => setView('add-goal')}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal}
        onLogIncome={handleLogIncome}
      />

      {/* GoalForm slides in as a modal overlay when adding or editing */}
      {(view === 'add-goal' || view === 'edit-goal') && (
        <GoalForm
          existingGoal={goalToEdit ?? undefined}
          onSave={handleSaveGoal}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default App
