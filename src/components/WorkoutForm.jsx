import { useEffect, useRef, useState } from 'react'
import { estimateOneRepMax } from '../lib/oneRepMax'
import { todayISO } from '../lib/dates'

const EMPTY_FORM = {
  exercise: '',
  weight: '',
  reps: '',
  unit: 'lb',
  date: todayISO(),
}

export function WorkoutForm({ onAdd, onSave, onCancelEdit, editingEntry, exerciseNames = [] }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [shake, setShake] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const formRef = useRef(null)
  const isEditing = Boolean(editingEntry)

  useEffect(() => {
    if (editingEntry) {
      setForm({
        exercise: editingEntry.exercise,
        weight: String(editingEntry.weight),
        reps: String(editingEntry.reps),
        unit: editingEntry.unit,
        date: editingEntry.date,
      })
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingEntry])

  const liveOneRm = estimateOneRepMax(form.weight, form.reps)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.exercise.trim() || !form.weight || !form.reps) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    const payload = {
      exercise: form.exercise.trim(),
      weight: Number(form.weight),
      reps: Number(form.reps),
      unit: form.unit,
      date: form.date,
    }

    if (isEditing) {
      onSave(editingEntry.id, payload)
    } else {
      onAdd({ id: crypto.randomUUID(), ...payload })
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 600)
    }

    setForm((prev) => ({ ...EMPTY_FORM, unit: prev.unit, date: prev.date }))
  }

  function handleCancel() {
    setForm((prev) => ({ ...EMPTY_FORM, unit: prev.unit, date: prev.date }))
    onCancelEdit()
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 dark:bg-neutral-900 ${
        isEditing
          ? 'border-blue-300 ring-1 ring-blue-100 dark:border-blue-800 dark:ring-blue-950'
          : 'border-neutral-200 dark:border-neutral-800'
      } ${shake ? 'animate-shake' : ''} ${justAdded ? 'animate-flash-success' : ''}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {isEditing ? 'Edit set' : 'Log a set'}
        </h2>
        {isEditing && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Editing {editingEntry.exercise}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4">
        <div className="col-span-2 sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Exercise
          </label>
          <input
            type="text"
            required
            list="exercise-options"
            placeholder="Bench Press"
            value={form.exercise}
            onChange={(e) => update('exercise', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
          <datalist id="exercise-options">
            {exerciseNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Weight
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            required
            placeholder="135"
            value={form.weight}
            onChange={(e) => update('weight', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Unit
          </label>
          <select
            value={form.unit}
            onChange={(e) => update('unit', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Reps
          </label>
          <input
            type="number"
            min="1"
            step="1"
            required
            placeholder="8"
            value={form.reps}
            onChange={(e) => update('reps', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {liveOneRm > 0 ? (
            <>
              Estimated 1RM:{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {liveOneRm.toFixed(1)} {form.unit}
              </span>
            </>
          ) : (
            'Enter weight and reps to preview estimated 1RM'
          )}
        </p>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="focus-ring rounded-lg px-3.5 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="focus-ring rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 active:bg-blue-800"
          >
            {isEditing ? 'Save changes' : 'Add set'}
          </button>
        </div>
      </div>
    </form>
  )
}
