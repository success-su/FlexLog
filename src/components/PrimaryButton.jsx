import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAccentGradient, useThemeColors } from '../lib/theme'

const CONTAINER_VARIANTS = {
  secondary:
    'border border-mist-300 active:bg-mist-100 dark:border-ink-700 dark:active:bg-ink-800',
  danger: 'bg-red-600 active:bg-red-700',
  dangerOutline:
    'border border-red-300 active:bg-red-50 dark:border-red-900 dark:active:bg-red-950',
  ghost: 'active:bg-mist-100 dark:active:bg-ink-800',
}

const TEXT_VARIANTS = {
  primary: 'text-white',
  secondary: 'text-mist-700 dark:text-ink-200',
  danger: 'text-white',
  dangerOutline: 'text-red-600 dark:text-red-400',
  ghost: 'text-mist-500 dark:text-ink-400',
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) {
  const gradient = useAccentGradient()
  const colors = useThemeColors()
  const isDisabled = disabled || loading

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`overflow-hidden rounded-xl transition active:scale-95 ${
          isDisabled ? 'opacity-40' : ''
        } ${className}`}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-semibold text-white">{label}</Text>
              {icon && <Ionicons name={icon} size={16} color="#fff" />}
            </View>
          )}
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center rounded-xl px-5 py-3.5 transition active:scale-95 ${
        CONTAINER_VARIANTS[variant]
      } ${isDisabled ? 'opacity-40' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? '#fff' : colors.accent} />
      ) : (
        <View className="flex-row items-center gap-1.5">
          <Text className={`text-sm font-semibold ${TEXT_VARIANTS[variant]}`}>{label}</Text>
          {icon && (
            <Ionicons name={icon} size={16} color={variant === 'danger' ? '#fff' : undefined} />
          )}
        </View>
      )}
    </Pressable>
  )
}
