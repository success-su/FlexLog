import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    AsyncStorage.getItem(key).then((stored) => {
      if (active && stored != null) {
        try {
          setValue(JSON.parse(stored))
        } catch {
          // ignore corrupt stored value
        }
      }
      if (active) setHydrated(true)
    })
    return () => {
      active = false
    }
  }, [key])

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {})
    }
  }, [key, value, hydrated])

  return [value, setValue]
}
