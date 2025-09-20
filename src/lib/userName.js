import { supabase } from "../lib/supabaseClient"

export async function getDisplayName() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const meta = user.user_metadata || {}
  const id0 = Array.isArray(user.identities) && user.identities.length > 0 ? user.identities[0] : null
  const idData = id0 && id0.identity_data ? id0.identity_data : {}
  return (
    meta.full_name ||
    meta.name ||
    idData.full_name ||
    idData.name ||
    (idData.given_name && idData.family_name ? `${idData.given_name} ${idData.family_name}` : null) ||
    user.email
  )
}
