import { RefreshControl, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeColors } from '../lib/theme'

export function ScreenContainer({ children, scroll = true, refreshing = false, onRefresh }) {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-mist-50 dark:bg-ink-950"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 gap-4 p-4">{children}</View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-mist-50 dark:bg-ink-950" style={{ paddingTop: insets.top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 14 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  )
}
