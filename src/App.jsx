import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import { NavBar } from './components/NavBar'
import { Toast } from './components/Toast'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'

function App() {
  const [entries, setEntries] = useLocalStorage('flexlog:entries', [])
  const [dark, setDark] = useLocalStorage(
    'flexlog:dark',
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const [unit, setUnit] = useLocalStorage('flexlog:unit', 'lb')
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimeout = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  function notify(data, duration = 4000) {
    clearTimeout(toastTimeout.current)
    setToast({ id: crypto.randomUUID(), duration, ...data })
    toastTimeout.current = setTimeout(() => setToast(null), duration)
  }

  const exerciseNames = useMemo(
    () => [...new Set(entries.map((e) => e.exercise))].sort(),
    [entries],
  )

  const editingEntry = entries.find((e) => e.id === editingId) ?? null

  function addEntry(entry) {
    setEntries((prev) => [entry, ...prev])
    notify({ message: `Logged ${entry.exercise}` })
  }

  function updateEntry(id, patch) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
    setEditingId(null)
    notify({ message: `Updated ${patch.exercise}` })
  }

  function deleteEntry(id) {
    const entry = entries.find((e) => e.id === id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) setEditingId(null)
    if (entry) {
      notify({
        message: `Removed ${entry.exercise} set`,
        actionLabel: 'Undo',
        onAction: () => setEntries((prev) => [entry, ...prev]),
      })
    }
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    navigate('/')
  }

  function importEntries(rawEntries) {
    const valid = rawEntries.filter(
      (e) =>
        e &&
        typeof e.exercise === 'string' &&
        e.exercise.trim() &&
        typeof e.weight === 'number' &&
        typeof e.reps === 'number' &&
        (e.unit === 'lb' || e.unit === 'kg') &&
        typeof e.date === 'string',
    )
    if (valid.length === 0) {
      notify({ message: 'No valid sets found in that file' })
      return
    }
    setEntries((prev) => [
      ...valid.map((e) => ({ ...e, id: crypto.randomUUID() })),
      ...prev,
    ])
    notify({ message: `Imported ${valid.length} set${valid.length === 1 ? '' : 's'}` })
  }

  function clearAllEntries() {
    setEntries([])
    setEditingId(null)
    notify({ message: 'Cleared all data' })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                FlexLog
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Log workouts, track your estimated 1RM, and stay consistent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="focus-ring shrink-0 rounded-lg border border-neutral-200 p-2.5 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-900 hover:rotate-12 active:scale-95 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
            >
              <span key={dark ? 'sun' : 'moon'} className="animate-pop block h-4 w-4">
                {dark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM15.657 14.596l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.061a.75.75 0 0 0 1.06-1.06ZM6.464 5.404l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06a.75.75 0 0 0 1.061-1.06Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <div className="mt-4">
            <NavBar />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div key={location.pathname} className="animate-fade-slide-in">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  entries={entries}
                  exerciseNames={exerciseNames}
                  editingEntry={editingEntry}
                  onAdd={addEntry}
                  onSave={updateEntry}
                  onCancelEdit={() => setEditingId(null)}
                />
              }
            />
            <Route
              path="/history"
              element={<History entries={entries} onDelete={deleteEntry} onEdit={startEdit} />}
            />
            <Route
              path="/progress"
              element={
                <Progress entries={entries} unit={unit} onUnitChange={setUnit} dark={dark} />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  entries={entries}
                  exerciseCount={exerciseNames.length}
                  dark={dark}
                  onToggleDark={() => setDark((d) => !d)}
                  onImport={importEntries}
                  onClearAll={clearAllEntries}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

export default App
