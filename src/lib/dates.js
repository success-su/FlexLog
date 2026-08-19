// Local-calendar-date key, e.g. "2026-08-16" — unlike toISOString(), this
// does not shift the date when the local timezone is ahead of UTC.
function localISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO() {
  return localISO(new Date())
}

export function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function weeklyConsistency(entries, weeks = 10) {
  const daysByWeek = new Map()
  const today = new Date()
  const cursor = startOfWeek(today)

  const weekKeys = []
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(cursor)
    weekStart.setDate(cursor.getDate() - i * 7)
    const key = localISO(weekStart)
    weekKeys.push(key)
    daysByWeek.set(key, new Set())
  }

  for (const entry of entries) {
    const entryDate = new Date(`${entry.date}T00:00:00`)
    const weekKey = localISO(startOfWeek(entryDate))
    if (daysByWeek.has(weekKey)) {
      daysByWeek.get(weekKey).add(entry.date)
    }
  }

  return weekKeys.map((key) => ({
    weekStart: key,
    label: new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    days: daysByWeek.get(key).size,
  }))
}

export function currentStreak(entries) {
  const loggedDays = new Set(entries.map((e) => e.date))
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // If today has no log yet, streak counts consecutive days ending yesterday.
  if (!loggedDays.has(localISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (loggedDays.has(localISO(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
