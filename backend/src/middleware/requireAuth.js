import { supabase } from '../db/supabaseClient.js'

// Verifies the Supabase access token sent from the frontend in the
// Authorization header, and attaches the resolved user to req.user.
//
// Frontend sends: Authorization: Bearer <supabase access_token>
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' })
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }

  req.user = data.user
  next()
}
