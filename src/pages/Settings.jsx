import { useRef, useState } from 'react'

export function Settings({ entries, exerciseCount, dark, onToggleDark, onImport, onClearAll }) {
  const fileInputRef = useRef(null)
  const [confirmingClear, setConfirmingClear] = useState(false)

  function handleExport() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flexlog-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (Array.isArray(parsed)) onImport(parsed)
      } catch {
        // ignore invalid file
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleClearClick() {
    if (confirmingClear) {
      onClearAll()
      setConfirmingClear(false)
    } else {
      setConfirmingClear(true)
      setTimeout(() => setConfirmingClear(false), 4000)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900 dark:text-white">
          Appearance
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-700 dark:text-neutral-200">Dark mode</p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Switch between light and dark themes.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            onClick={onToggleDark}
            className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition active:scale-95 ${
              dark ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ease-out ${
                dark ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-1.5 text-sm font-semibold text-neutral-900 dark:text-white">
          Your data
        </h2>
        <p className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
          {entries.length} set{entries.length === 1 ? '' : 's'} logged across {exerciseCount}{' '}
          exercise{exerciseCount === 1 ? '' : 's'}. Everything is stored locally in this browser.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={entries.length === 0}
            className="focus-ring rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Export as JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="focus-ring rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Import from JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportChange}
            className="hidden"
          />
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm sm:p-6 dark:border-red-900/50 dark:bg-neutral-900">
        <h2 className="mb-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
          Danger zone
        </h2>
        <p className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
          Permanently delete every logged set from this browser. This can't be undone.
        </p>
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={handleClearClick}
            disabled={entries.length === 0}
            className={`focus-ring rounded-lg px-3.5 py-2 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
              confirmingClear
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950'
            }`}
          >
            {confirmingClear ? 'Click again to confirm' : 'Clear all data'}
          </button>
          {confirmingClear && (
            <span className="absolute inset-x-2 -bottom-1 h-0.5 overflow-hidden rounded-full bg-red-200 dark:bg-red-900/60">
              <span
                className="block h-full bg-red-500"
                style={{ animation: 'toast-shrink 4000ms linear forwards' }}
              />
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
