import { useRef } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated'
import { estimateOneRepMax } from '../lib/oneRepMax'
import { useThemeColors } from '../lib/theme'
import { Badge } from './Badge'

function ActionButton({ icon, color, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[72px] items-center justify-center active:opacity-70"
      style={{ backgroundColor: color }}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text className="mt-1 text-[10px] font-semibold text-white">{label}</Text>
    </Pressable>
  )
}

export function EntryRow({ entry, isPR = false, onEdit, onRepeat, onDelete, index = 0 }) {
  const swipeableRef = useRef(null)
  const colors = useThemeColors()

  function close() {
    swipeableRef.current?.close()
  }

  function renderRightActions() {
    if (!onEdit && !onDelete) return null
    return (
      <View className="flex-row">
        {onEdit && (
          <ActionButton
            icon="pencil"
            color={colors.accent}
            label="Edit"
            onPress={() => {
              Haptics.selectionAsync()
              close()
              onEdit(entry)
            }}
          />
        )}
        {onDelete && (
          <ActionButton
            icon="trash"
            color="#dc2626"
            label="Delete"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              close()
              onDelete(entry.id)
            }}
          />
        )}
      </View>
    )
  }

  function renderLeftActions() {
    if (!onRepeat) return null
    return (
      <View className="flex-row">
        <ActionButton
          icon="repeat"
          color="#059669"
          label="Repeat"
          onPress={() => {
            Haptics.selectionAsync()
            close()
            onRepeat(entry)
          }}
        />
      </View>
    )
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40)
        .duration(220)
        .springify()
        .damping(18)}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={onEdit || onDelete ? renderRightActions : undefined}
        renderLeftActions={onRepeat ? renderLeftActions : undefined}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
        rightThreshold={32}
        leftThreshold={32}
        containerStyle={{ borderRadius: 12, overflow: 'hidden' }}
      >
        <View className="flex-row items-center justify-between bg-mist-50 px-4 py-3 dark:bg-ink-800/50">
          <View className="mr-3 flex-1 flex-row flex-wrap items-center gap-x-1.5 gap-y-1">
            <Text className="text-sm font-medium text-mist-700 dark:text-ink-200">
              {entry.exercise}
            </Text>
            <Text className="text-sm text-mist-500 dark:text-ink-400">
              {entry.sets > 1 ? `${entry.sets} × ` : ''}
              {entry.weight}
              {entry.unit} × {entry.reps}
            </Text>
            {isPR && (
              <Animated.View entering={ZoomIn.springify().damping(12)}>
                <Badge label="🏆 PR" tone="amber" />
              </Animated.View>
            )}
          </View>
          <Text className="text-xs text-mist-400 dark:text-ink-500">
            1RM ~{estimateOneRepMax(entry.weight, entry.reps).toFixed(1)}
            {entry.unit}
          </Text>
        </View>
      </Swipeable>
    </Animated.View>
  )
}
