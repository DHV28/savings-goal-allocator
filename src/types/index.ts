// These are the main data shapes used across the app.
// Everything gets saved to localStorage.

// A Goal is one savings target - like "Emergency Fund" or "Japan Trip"
export interface Goal {
  id: string               // random unique ID so we can find/update/delete it
  name: string             // what the user calls this goal
  targetAmount: number     // how much they want to save in total
  currentAmount: number    // how much they've saved so far
  deadline: string         // ISO date string e.g. "2025-12-31"
  allocationPercent: number // what % of each paycheck goes here (0–100)
  color: string            // just for visually telling goals apart on the dashboard
}

// Logged every time the user receives money (salary, freelance, etc.)
export interface IncomeEntry {
  id: string
  amount: number
  date: string  // ISO date string
  note: string  // optional label like "June salary"
}

// Returned by the allocation logic — shows how a single income entry was split
export interface AllocationResult {
  goalId: string
  goalName: string
  allocated: number          // actual amount sent to this goal
  allocationPercent: number  // the % used (copied from the goal at log time)
}
