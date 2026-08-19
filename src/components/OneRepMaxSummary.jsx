import { bestOneRepMaxByExercise } from '../lib/oneRepMax'

export function OneRepMaxSummary({ entries, unit, onUnitChange }) {
  const records = bestOneRepMaxByExercise(entries, unit)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Estimated 1-rep max
        </h2>
        <div className="flex overflow-hidden rounded-lg border border-neutral-200 text-xs font-medium dark:border-neutral-700">
          {['lb', 'kg'].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onUnitChange(u)}
              className={`focus-ring px-2.5 py-1.5 transition ${
                unit === u
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Log a set to see your estimated 1RM per exercise.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {records.map((r) => (
            <li
              key={r.exercise}
              className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 transition hover:border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
            >
              <span className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {r.exercise}
              </span>
              <span className="ml-2 shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400">
                {r.oneRm.toFixed(1)} {r.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
