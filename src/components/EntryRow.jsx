import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { estimateOneRepMax } from '../lib/oneRepMax'

export function EntryRow({ entry, isPR = false, onEdit, onDelete, index = 0 }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40)
        .duration(220)
        .springify()
        .damping(18)}
      className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800/50"
    >
      <View className="mr-3 flex-1 flex-row flex-wrap items-center gap-x-1.5 gap-y-1">
        <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {entry.exercise}
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          {entry.weight}
          {entry.unit} × {entry.reps}
        </Text>
        {isPR && (
          <View className="rounded-full bg-amber-50 px-1.5 py-0.5 dark:bg-amber-950">
            <Text className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              🏆 PR
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="mr-1 text-xs text-neutral-400 dark:text-neutral-500">
          1RM ~{estimateOneRepMax(entry.weight, entry.reps).toFixed(1)}
          {entry.unit}
        </Text>
        {onEdit && (
          <Pressable
            onPress={() => onEdit(entry)}
            hitSlop={6}
            className="rounded-md p-1.5 transition active:scale-90 active:bg-blue-50 dark:active:bg-blue-950"
          >
            <Ionicons name="pencil" size={16} color="#94a3b8" />
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            onPress={() => onDelete(entry.id)}
            hitSlop={6}
            className="rounded-md p-1.5 transition active:scale-90 active:bg-red-50 dark:active:bg-red-950"
          >
            <Ionicons name="trash" size={16} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  )
}
