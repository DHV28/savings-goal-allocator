import { useState } from 'react'
import type { Goal } from './types'
import { loadGoals, saveGoals } from './lib/storage'
import Dashboard from './components/Dashboard'

// monthlyIncome is stored in localStorage too so it persists across reloads
function loadMonthlyIncome(): number {
  return parseFloat(localStorage.getItem('monthlyIncome') ?? '0') || 0
}

function App() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(loadMonthlyIncome)

  function handleMonthlyIncomeChange(amount: number) {
    setMonthlyIncome(amount)
    localStorage.setItem('monthlyIncome', String(amount))
  }

  function handleDeleteGoal(id: string) {
    const updated = goals.filter(g => g.id !== id)
    setGoals(updated)
    saveGoals(updated)
  }

  // Placeholder handlers — GoalForm and IncomeForm coming next
  function handleAddGoal() {}
  function handleEditGoal(_goal: Goal) {}
  function handleLogIncome() {}

  return (
    <Dashboard
      goals={goals}
      monthlyIncome={monthlyIncome}
      onMonthlyIncomeChange={handleMonthlyIncomeChange}
      onAddGoal={handleAddGoal}
      onEditGoal={handleEditGoal}
      onDeleteGoal={handleDeleteGoal}
      onLogIncome={handleLogIncome}
    />
  )
}

export default App
