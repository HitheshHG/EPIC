import { supabase } from './supabaseClient'

export function registerOAuthTokenCapture() {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    const t = session?.provider_token
    const rt = session?.provider_refresh_token
    if (t) localStorage.setItem('oauth_provider_token', t)
    if (rt) localStorage.setItem('oauth_provider_refresh_token', rt)
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('oauth_provider_token')
      localStorage.removeItem('oauth_provider_refresh_token')
    }
  })
  return () => subscription.unsubscribe()
}
