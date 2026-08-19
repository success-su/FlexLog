import { useCountUp } from '../hooks/useCountUp'

export function StatCard({ label, value, suffix = '', onClick }) {
  const animated = useCountUp(value)
  const display = Math.round(animated)

  const content = (
    <>
      <p className="text-xl font-bold text-neutral-900 dark:text-white">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus-ring cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-95 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-900"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
      {content}
    </div>
  )
}
