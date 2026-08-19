export function friendlyAuthError(error) {
  const message = error?.message || 'Something went wrong. Please try again.'
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'An account with that email already exists.'
  }
  if (lower.includes('network')) return 'Network error. Check your connection.'

  // Supabase's own messages for weak passwords / invalid emails are already clear.
  return message
}
