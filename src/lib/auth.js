import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
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
