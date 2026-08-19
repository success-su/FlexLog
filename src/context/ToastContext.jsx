import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)
  const insets = useSafeAreaInsets()

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
          entering={FadeInDown.springify().damping(18).mass(0.6)}
          exiting={FadeOutDown.duration(150)}
          style={{ bottom: insets.bottom + 20 }}
          className="absolute left-4 right-4 overflow-hidden rounded-2xl bg-neutral-900 shadow-lg dark:bg-neutral-100"
        >
          <View className="flex-row items-center justify-between gap-3 px-4 py-3.5">
            <Text className="flex-1 text-sm text-white dark:text-neutral-900">
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
                  <Text className="text-sm font-semibold text-blue-400 dark:text-blue-600">
                    {toast.actionLabel}
                  </Text>
                </Pressable>
              )}
              <Pressable hitSlop={8} onPress={dismiss}>
                <Text className="text-neutral-400 dark:text-neutral-500">✕</Text>
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
