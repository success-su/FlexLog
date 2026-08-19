import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { estimateOneRepMax } from '../lib/oneRepMax'
import { todayISO } from '../lib/dates'
import { PrimaryButton } from './PrimaryButton'

const EMPTY_FORM = {
  exercise: '',
  weight: '',
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

export function WorkoutForm({ onAdd, onSave, onCancelEdit, editingEntry, exerciseNames = [] }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const isEditing = Boolean(editingEntry)

  const shakeX = useSharedValue(0)
  const flashOpacity = useSharedValue(0)

  useEffect(() => {
    if (editingEntry) {
      setForm({
        exercise: editingEntry.exercise,
        weight: String(editingEntry.weight),
        reps: String(editingEntry.reps),
        unit: editingEntry.unit,
        date: editingEntry.date,
      })
    }
  }, [editingEntry])

  const liveOneRm = estimateOneRepMax(form.weight, form.reps)

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
    if (!form.exercise.trim() || !form.weight || !form.reps) {
      playShake()
      return
    }

    const payload = {
      exercise: form.exercise.trim(),
      weight: Number(form.weight),
      reps: Number(form.reps),
      unit: form.unit,
      date: form.date,
    }

    if (isEditing) {
      onSave(editingEntry.id, payload)
    } else {
      onAdd(payload)
      playSuccessFlash()
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

  const suggestions = exerciseNames.filter(
    (name) =>
      form.exercise.length > 0 &&
      name.toLowerCase().includes(form.exercise.toLowerCase()) &&
      name.toLowerCase() !== form.exercise.toLowerCase(),
  )

  return (
    <Animated.View
      style={shakeStyle}
      className={`overflow-hidden rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900 ${
        isEditing
          ? 'border-blue-300 dark:border-blue-800'
          : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <Animated.View
        pointerEvents="none"
        style={flashStyle}
        className="absolute inset-0 rounded-2xl border-2 border-green-500"
      />

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
          {isEditing ? 'Edit set' : 'Log a set'}
        </Text>
        {isEditing && (
          <View className="rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-950">
            <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Editing {editingEntry.exercise}
            </Text>
          </View>
        )}
      </View>

      <View className="gap-3.5">
        <View>
          <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Exercise
          </Text>
          <TextInput
            value={form.exercise}
            onChangeText={(text) => update('exercise', text)}
            placeholder="Bench Press"
            placeholderTextColor="#a1a1aa"
            className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
          {suggestions.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-2"
              contentContainerStyle={{ gap: 8 }}
            >
              {suggestions.slice(0, 6).map((name) => (
                <Pressable
                  key={name}
                  onPress={() => update('exercise', name)}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 active:bg-neutral-200 dark:bg-neutral-800 dark:active:bg-neutral-700"
                >
                  <Text className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Weight
            </Text>
            <TextInput
              value={form.weight}
              onChangeText={(text) => update('weight', text)}
              placeholder="135"
              placeholderTextColor="#a1a1aa"
              keyboardType="decimal-pad"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Unit
            </Text>
            <View className="flex-row overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700">
              {['lb', 'kg'].map((u) => (
                <Pressable
                  key={u}
                  onPress={() => update('unit', u)}
                  className={`px-3.5 py-3 ${
                    form.unit === u ? 'bg-blue-600' : 'bg-white dark:bg-neutral-800'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      form.unit === u ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="flex-1">
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Reps
            </Text>
            <TextInput
              value={form.reps}
              onChangeText={(text) => update('reps', text)}
              placeholder="8"
              placeholderTextColor="#a1a1aa"
              keyboardType="number-pad"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </View>
        </View>

        <View>
          <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Date
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 active:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:active:bg-neutral-700"
          >
            <Text className="text-sm text-neutral-900 dark:text-white">
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

      <View className="mt-4 flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-xs text-neutral-500 dark:text-neutral-400">
          {liveOneRm > 0 ? (
            <>
              Est. 1RM{' '}
              <Text className="font-semibold text-blue-600 dark:text-blue-400">
                {liveOneRm.toFixed(1)} {form.unit}
              </Text>
            </>
          ) : (
            'Enter weight and reps to preview 1RM'
          )}
        </Text>
      </View>

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
