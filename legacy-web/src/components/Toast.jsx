import { useEffect, useState } from 'react'

export function Toast({ toast, onDismiss }) {
  const [displayed, setDisplayed] = useState(toast)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (toast) {
      setDisplayed(toast)
      setLeaving(false)
    } else if (displayed) {
      setLeaving(true)
      const timer = setTimeout(() => setDisplayed(null), 180)
      return () => clearTimeout(timer)
    }
    // Intentionally ignoring `displayed` — it must not retrigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast])

  if (!displayed) return null

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg bg-neutral-900 text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900 ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <div className="flex items-center gap-4 py-3 pr-3 pl-4 text-sm">
        <span className="min-w-0 flex-1">{displayed.message}</span>
        <div className="flex shrink-0 items-center gap-3">
          {displayed.actionLabel && (
            <button
              type="button"
              onClick={() => {
                displayed.onAction?.()
                onDismiss()
              }}
              className="focus-ring rounded font-semibold text-blue-400 transition hover:text-blue-300 active:scale-95 dark:text-blue-600 dark:hover:text-blue-700"
            >
              {displayed.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="focus-ring rounded p-1 text-neutral-400 transition hover:text-white active:scale-90 dark:text-neutral-500 dark:hover:text-neutral-900"
          >
            ✕
          </button>
        </div>
      </div>
      {!leaving && (
        <div
          key={displayed.id}
          className="h-0.5 bg-blue-400/70 dark:bg-blue-600/70"
          style={{ animation: `toast-shrink ${displayed.duration ?? 4000}ms linear forwards` }}
        />
      )}
    </div>
  )
}
