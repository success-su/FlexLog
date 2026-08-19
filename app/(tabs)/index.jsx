import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { ScreenContainer } from '../../src/components/ScreenContainer'
import { WorkoutForm } from '../../src/components/WorkoutForm'
import { StatCard } from '../../src/components/StatCard'
import { EntryRow } from '../../src/components/EntryRow'
import { useEntriesContext } from '../../src/context/EntriesContext'
import { useToast } from '../../src/context/ToastContext'
import { currentStreak, startOfWeek } from '../../src/lib/dates'

export default function LogScreen() {
  const router = useRouter()
  const notify = useToast()
  const { entries, addEntry, updateEntry, editingEntry, cancelEdit } = useEntriesContext()

  const exerciseNames = useMemo(
    () => [...new Set(entries.map((e) => e.exercise))].sort(),
    [entries],
  )

  const streak = useMemo(() => currentStreak(entries), [entries])

  const setsThisWeek = useMemo(() => {
    const weekStart = startOfWeek(new Date())
    return entries.filter((e) => new Date(`${e.date}T00:00:00`) >= weekStart).length
  }, [entries])

  const recent = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 5),
    [entries],
  )

  async function handleAdd(entry) {
    try {
      await addEntry(entry)
      notify({ message: `Logged ${entry.exercise}` })
    } catch {
      notify({ message: 'Could not save that set. Check your connection.' })
    }
  }

  async function handleSave(id, patch) {
    try {
      await updateEntry(id, patch)
      cancelEdit()
      notify({ message: `Updated ${patch.exercise}` })
    } catch {
      notify({ message: 'Could not save changes. Check your connection.' })
    }
  }

  const stats = [
    {
      label: 'Current streak',
      value: streak,
      suffix: ' 🔥',
      onPress: () => router.push('/progress'),
    },
    { label: 'Sets this week', value: setsThisWeek, onPress: () => router.push('/history') },
    { label: 'Total sets logged', value: entries.length, onPress: () => router.push('/history') },
    {
      label: 'Exercises tracked',
      value: exerciseNames.length,
      onPress: () => router.push('/progress'),
    },
  ]

  return (
    <ScreenContainer>
      <View>
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">FlexLog</Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Log workouts, track your estimated 1RM, and stay consistent.
        </Text>
      </View>

      <WorkoutForm
        onAdd={handleAdd}
        onSave={handleSave}
        onCancelEdit={cancelEdit}
        editingEntry={editingEntry}
        exerciseNames={exerciseNames}
      />

      <View className="flex-row flex-wrap gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} suffix={s.suffix} onPress={s.onPress} />
        ))}
      </View>

      <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
            Recent activity
          </Text>
          <Pressable onPress={() => router.push('/history')} hitSlop={8}>
            <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
              View full history →
            </Text>
          </Pressable>
        </View>

        {recent.length === 0 ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Nothing logged yet — add your first set above.
          </Text>
        ) : (
          <View className="gap-2">
            {recent.map((entry, i) => (
              <EntryRow key={entry.id} entry={entry} index={i} />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  )
}
