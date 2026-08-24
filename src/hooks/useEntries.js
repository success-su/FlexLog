import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!user) return
      if (!silent) setLoading(true)
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) console.warn('Failed to load entries:', error.message)
      setEntries(data ?? [])
      setLoading(false)
    },
    [user],
  )

  useEffect(() => {
    if (!user) {
      setEntries([])
      setLoading(false)
      return undefined
    }

    load()

    const channel = supabase
      .channel(`entries-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries', filter: `user_id=eq.${user.id}` },
        () => load({ silent: true }),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, load])

  async function refresh() {
    setRefreshing(true)
    await load({ silent: true })
    setRefreshing(false)
  }

  async function addEntry(entry) {
    if (!user) return
    const { error } = await supabase.from('entries').insert({ ...entry, user_id: user.id })
    if (error) throw error
  }

  async function updateEntry(id, patch) {
    const { error } = await supabase.from('entries').update(patch).eq('id', id)
    if (error) throw error
  }

  async function deleteEntry(id) {
    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (error) throw error
  }

  async function restoreEntry(entry) {
    if (!user) return
    const { id, ...data } = entry
    const { error } = await supabase.from('entries').insert({ id, ...data, user_id: user.id })
    if (error) throw error
  }

  async function clearAllEntries() {
    if (!user) return
    const { error } = await supabase.from('entries').delete().eq('user_id', user.id)
    if (error) throw error
  }

  return {
    entries,
    loading,
    refreshing,
    refresh,
    addEntry,
    updateEntry,
    deleteEntry,
    restoreEntry,
    clearAllEntries,
  }
}
