import { useMemo, useState } from 'react'
import { bestOneRepMaxByExercise, estimateOneRepMax } from '../lib/oneRepMax'

function groupByDate(entries) {
  const groups = new Map()
  for (const entry of entries) {
    if (!groups.has(entry.date)) groups.set(entry.date, [])
    groups.get(entry.date).push(entry)
  }
  return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export function WorkoutHistory({ entries, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all')

  const exerciseNames = useMemo(
    () => [...new Set(entries.map((e) => e.exercise))].sort(),
    [entries],
  )

  const prEntryIds = useMemo(() => {
    const map = new Map()
    for (const record of bestOneRepMaxByExercise(entries)) {
      map.set(record.exercise, record.entryId)
    }
    return map
  }, [entries])

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.exercise === filter)
  const grouped = groupByDate(filtered)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          History
        </h2>

        {exerciseNames.length > 0 && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="focus-ring rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-700 outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All exercises</option>
            {exerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      {grouped.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {entries.length === 0
            ? 'No sets logged yet. Log your first one from the Log page.'
            : 'No sets for this exercise yet.'}
        </p>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, sets]) => (
            <div key={date}>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <ul className="space-y-2">
                {sets.map((entry) => {
                  const isPR = prEntryIds.get(entry.exercise) === entry.id
                  return (
                    <li
                      key={entry.id}
                      className="animate-fade-slide-in flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 text-sm transition hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
                    >
                      <div className="min-w-0 truncate text-neutral-700 dark:text-neutral-200">
                        <span className="font-medium">{entry.exercise}</span>{' '}
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {entry.weight}
                          {entry.unit} × {entry.reps}
                        </span>
                        {isPR && (
                          <span className="ml-2 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            🏆 PR
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-1">
                        <span className="mr-1 text-xs text-neutral-400 dark:text-neutral-500">
                          1RM ~{estimateOneRepMax(entry.weight, entry.reps).toFixed(1)}
                          {entry.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => onEdit(entry)}
                          aria-label={`Edit ${entry.exercise} set`}
                          className="focus-ring rounded-md p-1.5 text-neutral-400 transition hover:scale-110 hover:bg-blue-50 hover:text-blue-500 active:scale-95 dark:hover:bg-blue-950"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(entry.id)}
                          aria-label={`Delete ${entry.exercise} set`}
                          className="focus-ring rounded-md p-1.5 text-neutral-400 transition hover:scale-110 hover:bg-red-50 hover:text-red-500 active:scale-95 dark:hover:bg-red-950"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
