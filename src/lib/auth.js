import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
  if (error) console.error(error)
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}
