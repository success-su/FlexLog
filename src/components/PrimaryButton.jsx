import { ActivityIndicator, Pressable, Text } from 'react-native'

const CONTAINER_VARIANTS = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary:
    'border border-neutral-300 active:bg-neutral-100 dark:border-neutral-700 dark:active:bg-neutral-800',
  danger: 'bg-red-600 active:bg-red-700',
  dangerOutline:
    'border border-red-300 active:bg-red-50 dark:border-red-900 dark:active:bg-red-950',
  ghost: 'active:bg-neutral-100 dark:active:bg-neutral-800',
}

const TEXT_VARIANTS = {
  primary: 'text-white',
  secondary: 'text-neutral-700 dark:text-neutral-200',
  danger: 'text-white',
  dangerOutline: 'text-red-600 dark:text-red-400',
  ghost: 'text-neutral-500 dark:text-neutral-400',
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center rounded-xl px-5 py-3.5 transition active:scale-95 ${
        CONTAINER_VARIANTS[variant]
      } ${disabled || loading ? 'opacity-40' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#3b82f6'} />
      ) : (
        <Text className={`text-sm font-semibold ${TEXT_VARIANTS[variant]}`}>{label}</Text>
      )}
    </Pressable>
  )
}
