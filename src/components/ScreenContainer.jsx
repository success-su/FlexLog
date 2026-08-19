import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function ScreenContainer({ children, scroll = true }) {
  const insets = useSafeAreaInsets()

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-neutral-50 dark:bg-neutral-950"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 gap-4 p-4">{children}</View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950" style={{ paddingTop: insets.top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 16 }}
      >
        {children}
      </ScrollView>
    </View>
  )
}
