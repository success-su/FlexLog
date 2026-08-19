import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenContainer } from '../../src/components/ScreenContainer'
import { EntryRow } from '../../src/components/EntryRow'
import { useEntriesContext } from '../../src/context/EntriesContext'
import { useToast } from '../../src/context/ToastContext'
import { bestOneRepMaxByExercise } from '../../src/lib/oneRepMax'

function groupByDate(entries) {
  const groups = new Map()
  for (const entry of entries) {
    if (!groups.has(entry.date)) groups.set(entry.date, [])
    groups.get(entry.date).push(entry)
  }
  return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export default function HistoryScreen() {
  const router = useRouter()
  const notify = useToast()
  const { entries, deleteEntry, restoreEntry, startEdit } = useEntriesContext()
  const [filter, setFilter] = useState('all')

  const exerciseNames = useMemo(
    () => [...new Set(entries.map((e) => e.exercise))].sort(),
    [entries],
  )

  const prEntryIds = useMemo(() => {
    const map = new Map()
    for (const record of bestOneRepMaxByExercise(entries)) map.set(record.exercise, record.entryId)
    return map
  }, [entries])

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.exercise === filter)
  const grouped = groupByDate(filtered)

  function handleEdit(entry) {
    startEdit(entry)
    router.push('/')
  }

  async function handleDelete(id) {
    const entry = entries.find((e) => e.id === id)
    try {
      await deleteEntry(id)
      if (entry) {
        notify({
          message: `Removed ${entry.exercise} set`,
          actionLabel: 'Undo',
          onAction: () => restoreEntry(entry),
        })
      }
    } catch {
      notify({ message: 'Could not delete that set. Check your connection.' })
    }
  }

  return (
    <ScreenContainer>
      <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <Text className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          History
        </Text>

        {exerciseNames.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {['all', ...exerciseNames].map((name) => (
              <Pressable
                key={name}
                onPress={() => setFilter(name)}
                className={`rounded-full px-3.5 py-1.5 transition active:scale-95 ${
                  filter === name ? 'bg-blue-600' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    filter === name ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {name === 'all' ? 'All exercises' : name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {grouped.length === 0 ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {entries.length === 0
              ? 'No sets logged yet. Log your first one from the Log tab.'
              : 'No sets for this exercise yet.'}
          </Text>
        ) : (
          <View className="gap-5">
            {grouped.map(([date, sets]) => (
              <View key={date}>
                <Text className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                  {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View className="gap-2">
                  {sets.map((entry, i) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      index={i}
                      isPR={prEntryIds.get(entry.exercise) === entry.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  )
}
