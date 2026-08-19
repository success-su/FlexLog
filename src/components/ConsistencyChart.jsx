import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { useColorScheme } from 'nativewind'
import { weeklyConsistency, currentStreak } from '../lib/dates'

export function ConsistencyChart({ entries }) {
  const { colorScheme } = useColorScheme()
  const dark = colorScheme === 'dark'
  const weeks = useMemo(() => weeklyConsistency(entries, 8), [entries])
  const streak = useMemo(() => currentStreak(entries), [entries])

  const barColor = dark ? '#60a5fa' : '#2a78d6'
  const textColor = dark ? '#a1a1aa' : '#898781'
  const ruleColor = dark ? '#27272a' : '#f1f0eb'
  const axisColor = dark ? '#3f3f46' : '#e1e0d9'

  const data = weeks.map((w) => ({
    value: w.days,
    label: w.label,
    frontColor: barColor,
  }))

  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <View className="mb-4 flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
          Consistency
        </Text>
        <View className="rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-950">
          <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            🔥 {streak} day streak
          </Text>
        </View>
      </View>
      <BarChart
        data={data}
        maxValue={7}
        noOfSections={7}
        barWidth={16}
        spacing={14}
        barBorderRadius={4}
        yAxisTextStyle={{ color: textColor, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: textColor, fontSize: 10 }}
        yAxisColor="transparent"
        xAxisColor={axisColor}
        rulesColor={ruleColor}
        isAnimated
        animationDuration={400}
        height={170}
      />
    </View>
  )
}
