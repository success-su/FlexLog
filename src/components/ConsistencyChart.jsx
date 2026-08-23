import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { useColorScheme } from 'nativewind'
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated'
import { weeklyConsistency, currentStreak } from '../lib/dates'
import { CARD_CLASSNAME } from './Card'
import { Badge } from './Badge'
import { useThemeColors } from '../lib/theme'

export function ConsistencyChart({ entries }) {
  const { colorScheme } = useColorScheme()
  const colors = useThemeColors()
  const dark = colorScheme === 'dark'
  const weeks = useMemo(() => weeklyConsistency(entries, 8), [entries])
  const streak = useMemo(() => currentStreak(entries), [entries])

  const ruleColor = dark ? '#27272a' : '#f5f5f5'
  const axisColor = dark ? '#3f3f46' : '#e5e5e5'

  const data = weeks.map((w) => ({
    value: w.days,
    label: w.label,
    frontColor: colors.accent,
  }))

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify().damping(18)}
      className={CARD_CLASSNAME}
    >
      <View className="mb-4 flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-sm font-semibold text-mist-900 dark:text-white">
          Consistency
        </Text>
        <Animated.View key={streak} entering={ZoomIn.springify().damping(12)}>
          <Badge label={`🔥 ${streak} day streak`} tone="accent" />
        </Animated.View>
      </View>
      <BarChart
        data={data}
        maxValue={7}
        noOfSections={7}
        barWidth={16}
        spacing={14}
        barBorderRadius={4}
        yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
        yAxisColor="transparent"
        xAxisColor={axisColor}
        rulesColor={ruleColor}
        isAnimated
        animationDuration={400}
        height={170}
      />
    </Animated.View>
  )
}
