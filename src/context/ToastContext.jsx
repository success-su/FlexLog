import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import Animated, { FadeInDown, FadeOutDown, ZoomIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ACCENTS } from '../lib/theme'
import { useAccent } from './AccentContext'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const [accentId] = useAccent()
  const accent = ACCENTS[accentId] ?? ACCENTS.blue
  // The toast surface is inverted from the screen's scheme (dark toast on a
  // light screen and vice versa), so its action label needs the *opposite*
  // scheme's accent shade for contrast, not the normal useThemeColors() one.
  const actionColor = colorScheme === 'dark' ? accent.light : accent.dark

  const notify = useCallback((data, duration = 3000) => {
    clearTimeout(timeoutRef.current)
    setToast({ id: Date.now(), duration, ...data })
    timeoutRef.current = setTimeout(() => setToast(null), duration)
  }, [])

  const dismiss = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      <View className="flex-1">{children}</View>
      {toast && (
        <Animated.View
          key={toast.id}
          entering={
            toast.celebrate
              ? ZoomIn.springify().damping(11).mass(0.6)
              : FadeInDown.springify().damping(18).mass(0.6)
          }
          exiting={FadeOutDown.duration(150)}
          style={{ bottom: insets.bottom + 20 }}
          className={`absolute left-4 right-4 overflow-hidden rounded-2xl shadow-lg ${
            toast.celebrate ? 'bg-amber-500' : 'bg-neutral-900 dark:bg-neutral-100'
          }`}
        >
          <View className="flex-row items-center justify-between gap-3 px-4 py-3.5">
            <Text
              className={`flex-1 text-sm font-medium ${
                toast.celebrate ? 'text-white' : 'text-white dark:text-neutral-900'
              }`}
            >
              {toast.message}
            </Text>
            <View className="flex-row items-center gap-4">
              {toast.actionLabel && (
                <Pressable
                  hitSlop={8}
                  onPress={() => {
                    toast.onAction?.()
                    dismiss()
                  }}
                >
                  <Text
                    className={`text-sm font-semibold ${toast.celebrate ? 'text-white underline' : ''}`}
                    style={toast.celebrate ? undefined : { color: actionColor }}
                  >
                    {toast.actionLabel}
                  </Text>
                </Pressable>
              )}
              <Pressable hitSlop={8} onPress={dismiss}>
                <Text
                  className={toast.celebrate ? 'text-amber-100' : 'text-mist-400 dark:text-ink-500'}
                >
                  ✕
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
