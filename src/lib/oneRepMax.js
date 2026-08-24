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

// Chronological estimated-1RM per session for one exercise, most recent
// `limit` sessions — feeds the expandable trend sparkline on the Progress tab.
export function oneRmTrendForExercise(entries, exercise, targetUnit = 'lb', limit = 8) {
  const forExercise = entries
    .filter((e) => e.exercise === exercise)
    .map((e) => ({
      date: e.date,
      oneRm: estimateOneRepMax(convertWeight(e.weight, e.unit, targetUnit), e.reps),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

  return forExercise.slice(Math.max(0, forExercise.length - limit))
}
