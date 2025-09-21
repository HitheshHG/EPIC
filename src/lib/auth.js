import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  const isProduction = window.location.hostname !== 'localhost'
  const redirectUrl = isProduction
    ? 'https://epic-hg.vercel.app/auth/callback'
    : 'http://localhost:5173/auth/callback'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) console.error(error)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Error signing out:', error)
  localStorage.removeItem('guest')
  window.location.assign('/')
}
