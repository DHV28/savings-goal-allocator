// Goal progress logic — answers "am I on track to hit my goal by the deadline?"
//
// Example: Goal is $1200, I have $300, deadline is 6 months away.
// Required pace = ($1200 - $300) / 6 = $150/month
// If my current allocation gives me $150+/month → on track ✓
// If it gives me less → behind ✗

import { differenceInMonths, parseISO, isAfter } from 'date-fns'
import type { Goal } from '../types'

// How many months are left until the deadline (from today)
export function monthsRemaining(deadline: string): number {
  const today = new Date()
  const deadlineDate = parseISO(deadline)

  // If the deadline has already passed, return 0
  if (!isAfter(deadlineDate, today)) return 0

  return differenceInMonths(deadlineDate, today)
}

// How much the user needs to save per month to hit the goal in time
export function requiredMonthlySavings(goal: Goal): number {
  const remaining = goal.targetAmount - goal.currentAmount

  // Already hit the goal
  if (remaining <= 0) return 0

  const months = monthsRemaining(goal.deadline)

  // No months left — can't reach it (avoid divide by zero)
  if (months === 0) return Infinity

  return parseFloat((remaining / months).toFixed(2))
}

// Given a typical monthly income, how much will this goal actually receive per month?
export function projectedMonthlySavings(goal: Goal, monthlyIncome: number): number {
  return parseFloat(((goal.allocationPercent / 100) * monthlyIncome).toFixed(2))
}

// The status tells the UI what badge to show on the goal card
export type GoalStatus = 'on-track' | 'behind' | 'reached' | 'expired'

export interface GoalProgressInfo {
  status: GoalStatus
  requiredPerMonth: number   // what you need
  projectedPerMonth: number  // what your current % gives you
  monthsLeft: number
}

// Main function — call this to get the full progress picture for a goal
export function getGoalProgress(goal: Goal, monthlyIncome: number): GoalProgressInfo {
  const monthsLeft = monthsRemaining(goal.deadline)
  const requiredPerMonth = requiredMonthlySavings(goal)
  const projectedPerMonth = projectedMonthlySavings(goal, monthlyIncome)

  let status: GoalStatus

  if (goal.currentAmount >= goal.targetAmount) {
    status = 'reached'
  } else if (monthsLeft === 0) {
    status = 'expired'
  } else if (projectedPerMonth >= requiredPerMonth) {
    status = 'on-track'
  } else {
    status = 'behind'
  }

  return { status, requiredPerMonth, projectedPerMonth, monthsLeft }
}
