import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  // Get the current origin dynamically for proper redirects
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/dashboard`,
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
