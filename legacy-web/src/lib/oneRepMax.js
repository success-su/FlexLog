import { convertWeight } from './units'

// Epley formula: widely used, accurate for the 1-10 rep range most logs fall into.
export function estimateOneRepMax(weight, reps) {
  const w = Number(weight)
  const r = Number(reps)
  if (!w || !r || w <= 0 || r <= 0) return 0
  if (r === 1) return w
  return w * (1 + r / 30)
}

// Converts every entry to targetUnit before comparing, so a PR logged in kg
// is still correctly ranked against sets logged in lb for the same exercise.
export function bestOneRepMaxByExercise(entries, targetUnit = 'lb') {
  const best = {}
  for (const entry of entries) {
    const weightInTarget = convertWeight(entry.weight, entry.unit, targetUnit)
    const oneRm = estimateOneRepMax(weightInTarget, entry.reps)
    const existing = best[entry.exercise]
    if (!existing || oneRm > existing.oneRm) {
      best[entry.exercise] = {
        oneRm,
        unit: targetUnit,
        date: entry.date,
        entryId: entry.id,
      }
    }
  }
  return Object.entries(best)
    .map(([exercise, data]) => ({ exercise, ...data }))
    .sort((a, b) => b.oneRm - a.oneRm)
}
