import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Animated, {
  
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { estimateOneRepMax } from '../lib/oneRepMax'
import { todayISO } from '../lib/dates'
import { iconForExercise } from '../lib/exerciseIcons'
import { PrimaryButton } from './PrimaryButton'
import { TextField } from './TextField'
import { Stepper } from './Stepper'
import { ExercisePicker } from './ExercisePicker'
import { Badge } from './Badge'
import { useThemeColors } from '../lib/theme'
import { useExercisesContext } from '../context/ExercisesContext'

const EMPTY_FORM = {
  exercise: '',
  weight: '',
  sets: '1',
  reps: '',
  unit: 'lb',
  date: todayISO(),
}

function formatDateLabel(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function WorkoutForm({ onAdd, onSave, onCancelEdit, editingEntry, prefillEntry }) {
  const colors = useThemeColors()
  const { exercises } = useExercisesContext()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const isEditing = Boolean(editingEntry)

  const shakeX = useSharedValue(0)
  const flashOpacity = useSharedValue(0)

  useEffect(() => {
    if (editingEntry) {
      setForm({
        exercise: editingEntry.exercise,
        weight: String(editingEntry.weight),
        sets: String(editingEntry.sets ?? 1),
        reps: String(editingEntry.reps),
        unit: editingEntry.unit,
        date: editingEntry.date,
      })
    }
  }, [editingEntry])

  useEffect(() => {
    if (prefillEntry) {
      setForm((prev) => ({
        ...prev,
        exercise: prefillEntry.exercise,
        weight: String(prefillEntry.weight),
        sets: String(prefillEntry.sets ?? 1),
        reps: String(prefillEntry.reps),
        unit: prefillEntry.unit,
      }))
    }
  }, [prefillEntry])

  const liveOneRm = estimateOneRepMax(form.weight, form.reps)
  const selectedExercise = exercises.find(
    (e) => e.name.toLowerCase() === form.exercise.toLowerCase(),
  )
  const exerciseIcon = form.exercise
    ? iconForExercise(form.exercise, selectedExercise?.category)
    : 'dumbbell'

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function playShake() {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 80 }),
      withTiming(-4, { duration: 80 }),
      withTiming(4, { duration: 80 }),
      withTiming(0, { duration: 60 }),
    )
  }

  function playSuccessFlash() {
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 500 }),
    )
  }

  function handleSubmit() {
    if (!form.exercise.trim() || !form.weight || !form.reps || !form.sets) {
      playShake()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    const payload = {
      exercise: form.exercise.trim(),
      weight: Number(form.weight),
      sets: Number(form.sets),
      reps: Number(form.reps),
      unit: form.unit,
      date: form.date,
    }

    if (isEditing) {
      onSave(editingEntry.id, payload)
    } else {
      onAdd(payload)
      playSuccessFlash()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    setForm((prev) => ({ ...EMPTY_FORM, unit: prev.unit, date: prev.date }))
  }

  function handleCancel() {
    setForm((prev) => ({ ...EMPTY_FORM, unit: prev.unit, date: prev.date }))
    onCancelEdit()
  }

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }))

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }))

  return (
    <Animated.View
      style={[
        shakeStyle,
        isEditing ? { borderColor: colors.accent } : undefined,
      ]}
      className={`overflow-hidden rounded-2xl border bg-white p-5 dark:bg-ink-900 ${
        isEditing ? '' : 'border-mist-200/70 dark:border-ink-800'
      }`}
    >
      <Animated.View
        pointerEvents="none"
        style={flashStyle}
        className="absolute inset-0 rounded-2xl border-2 border-emerald-500"
      />

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-mist-900 dark:text-white">
          {isEditing ? 'Edit set' : 'Log a set'}
        </Text>
        {isEditing && <Badge label={`Editing ${editingEntry.exercise}`} tone="accent" />}
      </View>

      <View className="gap-3.5">
        <View>
          <Text className="mb-1.5 text-xs font-medium text-mist-500 dark:text-ink-400">
            Exercise
          </Text>
          <Pressable
            onPress={() => setShowExercisePicker(true)}
            className="flex-row items-center gap-2.5 rounded-xl border border-mist-300 bg-white px-3.5 py-3.5 transition active:bg-mist-50 dark:border-ink-700 dark:bg-ink-800 dark:active:bg-ink-700"
          >
            <MaterialCommunityIcons
              name={exerciseIcon}
              size={18}
              color={form.exercise ? colors.accent : colors.icon}
            />
            <Text
              className={`flex-1 text-base font-medium ${
                form.exercise
                  ? 'text-mist-900 dark:text-white'
                  : 'text-mist-400 dark:text-ink-500'
              }`}
            >
              {form.exercise || 'Select an exercise'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.icon} />
          </Pressable>
          <ExercisePicker
            visible={showExercisePicker}
            onClose={() => setShowExercisePicker(false)}
            onSelect={(name) => update('exercise', name)}
          />
        </View>

        <View className="flex-row gap-3">
          <TextField
            label="Weight"
            value={form.weight}
            onChangeText={(text) => update('weight', text)}
            placeholder="135"
            keyboardType="decimal-pad"
            className="flex-1"
          />

          <View>
            <Text className="mb-1.5 text-xs font-medium text-mist-500 dark:text-ink-400">
              Unit
            </Text>
            <View className="flex-row overflow-hidden rounded-xl border border-mist-300 dark:border-ink-700">
              {['lb', 'kg'].map((u) => (
                <Pressable
                  key={u}
                  onPress={() => {
                    Haptics.selectionAsync()
                    update('unit', u)
                  }}
                  className={`px-3.5 py-3 ${form.unit === u ? '' : 'bg-white dark:bg-ink-800'}`}
                  style={form.unit === u ? { backgroundColor: colors.accent } : undefined}
                >
                  <Text
                    className={`text-sm font-medium ${
                      form.unit === u ? 'text-white' : 'text-mist-600 dark:text-ink-300'
                    }`}
                  >
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Stepper
            label="Sets"
            value={form.sets}
            onChange={(text) => update('sets', text)}
            className="flex-1"
          />

          <Stepper
            label="Reps"
            value={form.reps}
            onChange={(text) => update('reps', text)}
            className="flex-1"
          />
        </View>

        <View>
          <Text className="mb-1.5 text-xs font-medium text-mist-500 dark:text-ink-400">
            Date
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center gap-2 self-start rounded-xl border border-mist-300 bg-white px-3.5 py-3 active:bg-mist-50 dark:border-ink-700 dark:bg-ink-800 dark:active:bg-ink-700"
          >
            <Ionicons name="calendar-outline" size={15} color={colors.icon} />
            <Text className="text-sm text-mist-900 dark:text-white">
              {formatDateLabel(form.date)}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(`${form.date}T00:00:00`)}
              mode="date"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false)
                if (event.type === 'set' && selectedDate) {
                  const y = selectedDate.getFullYear()
                  const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
                  const d = String(selectedDate.getDate()).padStart(2, '0')
                  update('date', `${y}-${m}-${d}`)
                }
              }}
            />
          )}
        </View>
      </View>

      <Animated.View
        key={liveOneRm > 0 ? 'preview' : 'empty'}
        entering={ZoomIn.duration(180)}
        className="mt-4 flex-row items-center justify-between rounded-xl px-4 py-3.5"
        style={{ backgroundColor: colors.accentSoft }}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="trending-up" size={15} color={colors.accent} />
          <Text className="text-xs font-medium text-mist-500 dark:text-ink-400">
            Estimated 1RM
          </Text>
        </View>
        {liveOneRm > 0 ? (
          <Text className="text-lg font-extrabold" style={{ color: colors.accent }}>
            {liveOneRm.toFixed(1)} <Text className="text-xs font-semibold">{form.unit}</Text>
          </Text>
        ) : (
          <Text className="text-xs text-mist-400 dark:text-ink-500">
            Enter weight &amp; reps
          </Text>
        )}
      </Animated.View>

      <View className="mt-4 flex-row gap-2.5">
        {isEditing && (
          <PrimaryButton label="Cancel" variant="secondary" onPress={handleCancel} className="flex-1" />
        )}
        <PrimaryButton
          label={isEditing ? 'Save changes' : 'Add set'}
          onPress={handleSubmit}
          className="flex-1"
        />
      </View>
    </Animated.View>
  )
}
