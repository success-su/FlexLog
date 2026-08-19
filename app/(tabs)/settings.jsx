import { useState } from 'react'
import { Alert, Pressable, Share, Text, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { ScreenContainer } from '../../src/components/ScreenContainer'
import { PrimaryButton } from '../../src/components/PrimaryButton'
import { useAuth } from '../../src/context/AuthContext'
import { useEntriesContext } from '../../src/context/EntriesContext'
import { useToast } from '../../src/context/ToastContext'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const { entries, clearAllEntries } = useEntriesContext()
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const notify = useToast()
  const [confirmingClear, setConfirmingClear] = useState(false)

  const exerciseCount = new Set(entries.map((e) => e.exercise)).size
  const dark = colorScheme === 'dark'

  async function handleExport() {
    if (entries.length === 0) return
    try {
      await Share.share({
        title: `flexlog-export-${new Date().toISOString().slice(0, 10)}.json`,
        message: JSON.stringify(entries, null, 2),
      })
    } catch {
      // user dismissed the share sheet
    }
  }

  async function handleClearPress() {
    if (confirmingClear) {
      await clearAllEntries()
      setConfirmingClear(false)
      notify({ message: 'Cleared all data' })
    } else {
      setConfirmingClear(true)
      setTimeout(() => setConfirmingClear(false), 4000)
    }
  }

  function handleSignOut() {
    Alert.alert('Log out', 'You can log back in anytime — your data stays synced.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <ScreenContainer>
      <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
          Account
        </Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-200">
          {user?.user_metadata?.full_name || 'Signed in'}
        </Text>
        <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {user?.email}
        </Text>
        <PrimaryButton
          label="Log out"
          variant="dangerOutline"
          onPress={handleSignOut}
          className="mt-4"
        />
      </View>

      <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <Text className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
          Appearance
        </Text>
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <Text className="text-sm text-neutral-700 dark:text-neutral-200">Dark mode</Text>
            <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Switch between light and dark themes.
            </Text>
          </View>
          <Pressable
            onPress={toggleColorScheme}
            className={`h-7 w-12 justify-center rounded-full p-0.5 transition active:scale-95 ${
              dark ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <View
              className={`h-6 w-6 rounded-full bg-white shadow transition-all ${
                dark ? 'ml-5' : 'ml-0'
              }`}
            />
          </Pressable>
        </View>
      </View>

      <View className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
          Your data
        </Text>
        <Text className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
          {entries.length} set{entries.length === 1 ? '' : 's'} logged across {exerciseCount}{' '}
          exercise{exerciseCount === 1 ? '' : 's'}. Synced to your account — log in on any device
          to pick up where you left off.
        </Text>
        <PrimaryButton
          label="Share as JSON"
          variant="secondary"
          onPress={handleExport}
          disabled={entries.length === 0}
        />
      </View>

      <View className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/50 dark:bg-neutral-900">
        <Text className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">
          Danger zone
        </Text>
        <Text className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
          Permanently delete every logged set from your account. This can't be undone.
        </Text>
        <PrimaryButton
          label={confirmingClear ? 'Tap again to confirm' : 'Clear all data'}
          variant={confirmingClear ? 'danger' : 'dangerOutline'}
          onPress={handleClearPress}
          disabled={entries.length === 0}
        />
      </View>
    </ScreenContainer>
  )
}
