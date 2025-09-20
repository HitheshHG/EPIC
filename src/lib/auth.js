import { supabase } from './supabaseClient'

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  if (error) console.error(error.message)
}

export async function signOut() {
  await supabase.auth.signOut()
  window.location.assign('/')
}
