import { Pressable, Text, View } from 'react-native'
import { bestOneRepMaxByExercise } from '../lib/oneRepMax'

export function OneRepMaxSummary({ entries, unit, onUnitChange }) {
  const records = bestOneRepMaxByExercise(entries, unit)

  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
          Estimated 1-rep max
        </Text>
        <View className="flex-row overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
          {['lb', 'kg'].map((u) => (
            <Pressable
              key={u}
              onPress={() => onUnitChange(u)}
              className={`px-2.5 py-1.5 transition ${
                unit === u ? 'bg-blue-600' : 'bg-white dark:bg-neutral-900'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  unit === u ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {u}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {records.length === 0 ? (
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Log a set to see your estimated 1RM per exercise.
        </Text>
      ) : (
        <View className="gap-2.5">
          {records.map((r) => (
            <View
              key={r.exercise}
              className="flex-row items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <Text
                numberOfLines={1}
                className="mr-2 flex-1 text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                {r.exercise}
              </Text>
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {r.oneRm.toFixed(1)} {r.unit}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
