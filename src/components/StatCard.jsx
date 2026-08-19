import { Pressable, Text, View } from 'react-native'
import { useCountUp } from '../hooks/useCountUp'

export function StatCard({ label, value, suffix = '', onPress }) {
  const animated = useCountUp(value)
  const display = Math.round(animated)

  const content = (
    <>
      <Text className="text-center text-2xl font-bold text-neutral-900 dark:text-white">
        {display}
        {suffix}
      </Text>
      <Text className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">
        {label}
      </Text>
    </>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="w-[47%] rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition active:scale-95 active:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800"
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View className="w-[47%] rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {content}
    </View>
  )
}
