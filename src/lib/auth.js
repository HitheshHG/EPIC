import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${import.meta.env.VITE_BASE_URL}/dashboard`
    }
  })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
  window.location.assign('/')
}
