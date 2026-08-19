import { createContext, useContext, useState } from 'react'
import { useEntries } from '../hooks/useEntries'

const EntriesContext = createContext(null)

export function EntriesProvider({ children }) {
  const entriesApi = useEntries()
  const [editingId, setEditingId] = useState(null)

  const editingEntry = entriesApi.entries.find((entry) => entry.id === editingId) ?? null

  function startEdit(entry) {
    setEditingId(entry.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  return (
    <EntriesContext.Provider value={{ ...entriesApi, editingEntry, startEdit, cancelEdit }}>
      {children}
    </EntriesContext.Provider>
  )
}

export function useEntriesContext() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error('useEntriesContext must be used within an EntriesProvider')
  return ctx
}
