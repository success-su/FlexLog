import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native'
import { Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../src/context/AuthContext'
import { PrimaryButton } from '../../src/components/PrimaryButton'
import { friendlyAuthError } from '../../src/lib/authErrors'

export default function SignupScreen() {
  const { signUp } = useAuth()
  const insets = useSafeAreaInsets()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setInfo('')
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const { needsEmailConfirmation } = await signUp(name, email, password)
      if (needsEmailConfirmation) {
        setInfo('Almost there — check your email to confirm your account, then log in.')
      }
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-neutral-50 dark:bg-neutral-950"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Create account</Text>
        <Text className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          Your sets sync automatically, so you can log in from any phone at any gym.
        </Text>

        <View className="mt-8 gap-3.5">
          <View>
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholder="Alex Rivera"
              placeholderTextColor="#a1a1aa"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </View>
          <View>
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#a1a1aa"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </View>
          <View>
            <Text className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 6 characters"
              placeholderTextColor="#a1a1aa"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </View>

          {error ? <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text> : null}
          {info ? (
            <Text className="text-sm text-green-600 dark:text-green-400">{info}</Text>
          ) : null}

          <PrimaryButton
            label="Create account"
            onPress={handleSubmit}
            loading={loading}
            className="mt-2"
          />
        </View>

        <View className="mt-6 flex-row justify-center gap-1.5">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Already have an account?
          </Text>
          <Link href="/" className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Log in
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
