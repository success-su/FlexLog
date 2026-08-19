export function friendlyAuthError(error) {
  const code = error?.code || ''
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found')
  ) {
    return 'Incorrect email or password.'
  }
  if (code.includes('email-already-in-use')) return 'An account with that email already exists.'
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.'
  if (code.includes('invalid-email')) return 'Enter a valid email address.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Try again shortly.'
  if (code.includes('network-request-failed')) return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}
