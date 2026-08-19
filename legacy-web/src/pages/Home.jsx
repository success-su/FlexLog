import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorkoutForm } from '../components/WorkoutForm'
import { StatCard } from '../components/StatCard'
import { estimateOneRepMax } from '../lib/oneRepMax'
import { currentStreak, startOfWeek } from '../lib/dates'

export function Home({ entries, exerciseNames, editingEntry, onAdd, onSave, onCancelEdit }) {
  const navigate = useNavigate()
  const streak = useMemo(() => currentStreak(entries), [entries])

  const setsThisWeek = useMemo(() => {
    const weekStart = startOfWeek(new Date())
    return entries.filter((e) => new Date(`${e.date}T00:00:00`) >= weekStart).length
  }, [entries])

  const recent = useMemo(
    () =>
      [...entries]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 5),
    [entries],
  )

  const stats = [
    { label: 'Current streak', value: streak, suffix: ' 🔥', onClick: () => navigate('/progress') },
    { label: 'Sets this week', value: setsThisWeek, onClick: () => navigate('/history') },
    { label: 'Total sets logged', value: entries.length, onClick: () => navigate('/history') },
    { label: 'Exercises tracked', value: exerciseNames.length, onClick: () => navigate('/progress') },
  ]

  return (
    <div className="space-y-6">
      <WorkoutForm
        onAdd={onAdd}
        onSave={onSave}
        onCancelEdit={onCancelEdit}
        editingEntry={editingEntry}
        exerciseNames={exerciseNames}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} suffix={s.suffix} onClick={s.onClick} />
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Recent activity
          </h2>
          <Link
            to="/history"
            className="focus-ring rounded text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View full history →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Nothing logged yet — add your first set above.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((entry, i) => (
              <li
                key={entry.id}
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
                className="animate-fade-slide-in flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 text-sm transition hover:translate-x-0.5 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
              >
                <div className="min-w-0 truncate text-neutral-700 dark:text-neutral-200">
                  <span className="font-medium">{entry.exercise}</span>{' '}
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {entry.weight}
                    {entry.unit} × {entry.reps}
                  </span>
                </div>
                <span className="ml-3 shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
                  {estimateOneRepMax(entry.weight, entry.reps).toFixed(1)}
                  {entry.unit} 1RM
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
