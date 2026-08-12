// All data lives in localStorage — no backend, no login needed.

import type { Goal, IncomeEntry } from '../types'

const GOALS_KEY = 'goals'
const INCOME_KEY = 'income'

// Goals — load and save
export function loadGoals(): Goal[] {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY) ?? '[]')
  } catch {
    // If somehow the stored value is corrupted, start fresh
    return []
  }
}

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

// Income entries — load and save
export function loadIncome(): IncomeEntry[] {
  try {
    return JSON.parse(localStorage.getItem(INCOME_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveIncome(entries: IncomeEntry[]): void {
  localStorage.setItem(INCOME_KEY, JSON.stringify(entries))
}
