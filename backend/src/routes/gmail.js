import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createOAuthClient, GMAIL_SCOPES } from '../config/googleClient.js'
import { createState, consumeState } from '../services/oauthStateStore.js'
import { supabaseAdmin } from '../db/supabaseAdmin.js'

const router = Router()

router.get('/connect', requireAuth, (req, res) => {
  const oauth2Client = createOAuthClient()
  const state = createState(req.user.id)

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GMAIL_SCOPES,
    state,
  })

  res.json({ authUrl })
})

router.get('/callback', async (req, res) => {
  const { code, state, error: googleError } = req.query
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  if (googleError) {
    return res.redirect(`${frontendUrl}/?gmail=denied`)
  }

  const userId = consumeState(state)
  if (!userId) {
    return res.redirect(`${frontendUrl}/?gmail=invalid_state`)
  }

  try {
    const oauth2Client = createOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    const { error: dbError } = await supabaseAdmin
      .from('connected_accounts')
      .upsert(
        {
          user_id: userId,
          provider: 'gmail',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : null,
          scope: tokens.scope,
          connected_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' }
      )

    if (dbError) throw dbError

    return res.redirect(`${frontendUrl}/?gmail=connected`)
  } catch (err) {
    console.error('[gmail/callback] Failed to store tokens:', err.message)
    return res.redirect(`${frontendUrl}/?gmail=error`)
  }
})

router.get('/status', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('connected_accounts')
    .select('connected_at, last_synced_at')
    .eq('user_id', req.user.id)
    .eq('provider', 'gmail')
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: 'Failed to check Gmail connection status' })
  }

  res.json({
    connected: !!data,
    connectedAt: data?.connected_at ?? null,
    lastSyncedAt: data?.last_synced_at ?? null,
  })
})

export default router