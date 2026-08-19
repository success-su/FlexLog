import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

export function useEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const entriesRef = useMemo(
    () => (user ? collection(db, 'users', user.uid, 'entries') : null),
    [user],
  )

  useEffect(() => {
    if (!entriesRef) {
      setEntries([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const entriesQuery = query(entriesRef, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      entriesQuery,
      (snapshot) => {
        setEntries(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
        setLoading(false)
      },
      (error) => {
        console.warn('Failed to sync entries:', error.message)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [entriesRef])

  async function addEntry(entry) {
    if (!entriesRef) return
    await addDoc(entriesRef, { ...entry, createdAt: serverTimestamp() })
  }

  async function updateEntry(id, patch) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'entries', id), patch)
  }

  async function deleteEntry(id) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'entries', id))
  }

  async function restoreEntry(entry) {
    if (!user) return
    const { id, ...data } = entry
    await setDoc(doc(db, 'users', user.uid, 'entries', id), data)
  }

  async function clearAllEntries() {
    if (!user) return
    await Promise.all(
      entries.map((entry) => deleteDoc(doc(db, 'users', user.uid, 'entries', entry.id))),
    )
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry, restoreEntry, clearAllEntries }
}
