// Allocation logic — splits an income amount across goals based on their percentages.
//
// Example: income = $1000, goals are [Emergency Fund 50%, Vacation 30%, Car 20%]
// Result: Emergency Fund gets $500, Vacation gets $300, Car gets $200

import { parseISO, isAfter } from 'date-fns'
import type { Goal, AllocationResult } from '../types'

// Takes the income amount and the list of goals, returns how much each goal gets.
// Only allocates to active goals — skips reached and expired ones.
// Their % goes to the unallocated pool instead.
// Uses isAfter from date-fns to match the same expiry logic used in goalProgress.ts.
export function allocateIncome(amount: number, goals: Goal[]): AllocationResult[] {
  const today = new Date()
  return goals
    .filter(goal =>
      goal.allocationPercent > 0 &&
      goal.currentAmount < goal.targetAmount &&
      isAfter(parseISO(goal.deadline), today)  // skip expired goals
    )
    .map(goal => ({
      goalId: goal.id,
      goalName: goal.name,
      allocationPercent: goal.allocationPercent,
      allocated: parseFloat(((goal.allocationPercent / 100) * amount).toFixed(2)), // 2 d.p
    }))
}

// Returns the total percentage allocated across active goals only.
// Reached and expired goals no longer compete for income, so their % shouldn't count.
export function getTotalAllocated(goals: Goal[]): number {
  const today = new Date()
  return goals
    .filter(goal =>
      goal.currentAmount < goal.targetAmount &&
      isAfter(parseISO(goal.deadline), today)
    )
    .reduce((sum, goal) => sum + goal.allocationPercent, 0)
}

// Checks if the percentages add up to exactly 100.
// The app doesn't block you if they don't — but we show a warning.
export function isFullyAllocated(goals: Goal[]): boolean {
  return getTotalAllocated(goals) === 100
}
