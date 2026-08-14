// Allocation logic — splits an income amount across goals based on their percentages.
//
// Example: income = $1000, goals are [Emergency Fund 50%, Vacation 30%, Car 20%]
// Result: Emergency Fund gets $500, Vacation gets $300, Car gets $200

import type { Goal, AllocationResult } from '../types'

// Takes the income amount and the list of goals, returns how much each goal gets.
// Only includes goals that have a non-zero allocation percent and haven't been reached yet.
// Skipping reached goals means their % goes to the unallocated pool instead.
export function allocateIncome(amount: number, goals: Goal[]): AllocationResult[] {
  return goals
    .filter(goal => goal.allocationPercent > 0 && goal.currentAmount < goal.targetAmount)
    .map(goal => ({
      goalId: goal.id,
      goalName: goal.name,
      allocationPercent: goal.allocationPercent,
      allocated: parseFloat(((goal.allocationPercent / 100) * amount).toFixed(2)), // 2 d.p
    }))
}

// Returns the total percentage allocated across all goals.
// Useful to warn the user if they've gone over 100% or left some unallocated.
export function getTotalAllocated(goals: Goal[]): number {
  return goals.reduce((sum, goal) => sum + goal.allocationPercent, 0)
}

// Checks if the percentages add up to exactly 100.
// The app doesn't block you if they don't — but we show a warning.
export function isFullyAllocated(goals: Goal[]): boolean {
  return getTotalAllocated(goals) === 100
}
