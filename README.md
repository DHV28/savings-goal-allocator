# Savings Goal Allocator

A personal finance web app that helps you set savings goals and automatically splits your income across them each month.

**Website link:** https://dhv28.github.io/savings-goal-allocator/

**Demo video:** https://drive.google.com/file/d/1MxBiDqQTkeWAI3tgDto0S1vOseOPYxLg/view?usp=drive_link


## What it does

- Add savings goals with a name, target amount, deadline, and percentage of income to allocate
- Log income entries and see exactly how each ringgit is split across your goals
- Get warned when a goal is behind pace and won't be reached by its deadline
- Track progress with a visual progress bar and on-track / behind / reached / expired status
- Unallocated income (when percentages don't add up to 100%) is saved in a general pool and automatically applied to your next new goal


## Tech stack

| Tool | Purpose |
|------|---------|
| React + TypeScript | UI components and state management |
| Vite | Development server and build tool |
| Tailwind CSS | Styling |
| date-fns | Date calculations (months remaining, deadline checks) |
| localStorage | Persisting goals and income data (no backend) |



## How to run locally

**Prerequisites:** Node.js installed (v18 or above recommended) — download from [nodejs.org](https://nodejs.org)

1. Clone the repository
   ```
   git clone https://github.com/DHV28/savings-goal-allocator
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173`

---

## Project structure

```
src/
  components/       # UI components (Dashboard, GoalCard, GoalForm, IncomeForm, AllocationResult)
  lib/              # Logic (allocation, goal progress, localStorage helpers)
  types/            # TypeScript interfaces (Goal, IncomeEntry, AllocationResult)
  App.tsx           # Root component — manages state and which screen is shown
```

---

## Notes

All data is stored in the browser's localStorage, nothing is sent to a server. Clearing your browser data will reset the app.
