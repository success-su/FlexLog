import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import * as Haptics from 'expo-haptics'
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { bestOneRepMaxByExercise, oneRmTrendForExercise } from '../lib/oneRepMax'
import { useThemeColors } from '../lib/theme'
import { Card } from './Card'
import { EmptyState } from './EmptyState'

const MEDALS = ['🥇', '🥈', '🥉']

function TrendSparkline({ entries, exercise, unit }) {
  const colors = useThemeColors()
  const trend = oneRmTrendForExercise(entries, exercise, unit)

  if (trend.length < 2) {
    return (
      <Text className="text-xs text-mist-400 dark:text-ink-500">
        Log this exercise again to see a trend.
      </Text>
    )
  }

  const data = trend.map((t) => ({ value: t.oneRm }))
  const last = trend[trend.length - 1]

  return (
    <View>
      <LineChart
        data={data}
        height={64}
        thickness={2.5}
        color={colors.accent}
        curved
        hideRules
        hideYAxisText
        yAxisColor="transparent"
        xAxisColor="transparent"
        initialSpacing={4}
        endSpacing={4}
        hideDataPoints={trend.length > 12}
        dataPointsColor={colors.accent}
        dataPointsRadius={3}
        areaChart
        startFillColor={colors.accent}
        endFillColor={colors.accent}
        startOpacity={0.18}
        endOpacity={0}
        isAnimated
        animationDuration={350}
      />
      <Text className="mt-1 text-xs text-mist-400 dark:text-ink-500">
        {trend.length} session{trend.length === 1 ? '' : 's'} · last{' '}
        {new Date(`${last.date}T00:00:00`).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}
      </Text>
    </View>
  )
}

export function OneRepMaxSummary({ entries, unit, onUnitChange }) {
  const colors = useThemeColors()
  const records = bestOneRepMaxByExercise(entries, unit)
  const [expanded, setExpanded] = useState(null)

  function toggleExpanded(exercise) {
    Haptics.selectionAsync()
    setExpanded((prev) => (prev === exercise ? null : exercise))
  }

  return (
    <Card>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-mist-900 dark:text-white">
          Estimated 1-rep max
        </Text>
        <View className="flex-row overflow-hidden rounded-lg border border-mist-200 dark:border-ink-700">
          {['lb', 'kg'].map((u) => (
            <Pressable
              key={u}
              onPress={() => {
                Haptics.selectionAsync()
                onUnitChange(u)
              }}
              className="px-2.5 py-1.5 transition"
              style={{ backgroundColor: unit === u ? colors.accent : undefined }}
            >
              <Text
                className={`text-xs font-medium ${
                  unit === u ? 'text-white' : 'text-mist-500 dark:text-ink-400'
                }`}
              >
                {u}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {records.length === 0 ? (
        <EmptyState
          icon="trending-up-outline"
          title="No lifts yet"
          subtitle="Log a set to see your estimated 1RM per exercise."
          compact
        />
      ) : (
        <View className="gap-1">
          {records.map((r, i) => {
            const isExpanded = expanded === r.exercise
            return (
              <Animated.View
                key={r.exercise}
                entering={FadeInDown.delay(i * 40)
                  .duration(220)
                  .springify()
                  .damping(18)}
              >
                <Pressable
                  onPress={() => toggleExpanded(r.exercise)}
                  className="flex-row items-center justify-between rounded-xl px-2 py-2.5 transition active:bg-mist-50 dark:active:bg-ink-800/60"
                >
                  <View className="flex-1 flex-row items-center gap-2.5">
                    <Text className="w-5 text-center text-xs font-semibold text-mist-400 dark:text-ink-500">
                      {MEDALS[i] ?? i + 1}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="flex-1 text-sm font-medium text-mist-700 dark:text-ink-200"
                    >
                      {r.exercise}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-sm font-semibold text-mist-900 dark:text-white">
                      {r.oneRm.toFixed(1)}{' '}
                      <Text className="text-xs font-normal text-mist-400 dark:text-ink-500">
                        {r.unit}
                      </Text>
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={colors.icon}
                    />
                  </View>
                </Pressable>

                {isExpanded && (
                  <Animated.View
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(120)}
                    className="mb-1 mt-1 rounded-xl bg-mist-50 px-3 py-3 dark:bg-ink-800/40"
                  >
                    <TrendSparkline entries={entries} exercise={r.exercise} unit={unit} />
                  </Animated.View>
                )}
              </Animated.View>
            )
          })}
        </View>
      )}
    </Card>
  )
}
