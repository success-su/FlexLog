import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { EntriesProvider } from '../../src/context/EntriesContext'

const ICONS = {
  index: 'barbell',
  history: 'time',
  progress: 'stats-chart',
  settings: 'settings',
}

const TITLES = {
  index: 'Log',
  history: 'History',
  progress: 'Progress',
  settings: 'Settings',
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <EntriesProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: dark ? '#60a5fa' : '#2563eb',
          tabBarInactiveTintColor: dark ? '#71717a' : '#a1a1aa',
          tabBarStyle: {
            backgroundColor: dark ? '#0a0a0a' : '#ffffff',
            borderTopColor: dark ? '#27272a' : '#e5e5e5',
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={`${ICONS[route.name]}${focused ? '' : '-outline'}`}
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Tabs.Screen name="index" options={{ title: TITLES.index }} />
        <Tabs.Screen name="history" options={{ title: TITLES.history }} />
        <Tabs.Screen name="progress" options={{ title: TITLES.progress }} />
        <Tabs.Screen name="settings" options={{ title: TITLES.settings }} />
      </Tabs>
    </EntriesProvider>
  )
}
