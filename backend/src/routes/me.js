import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// GET /api/me — protected route used to prove the backend can verify a
// Supabase session token issued to the frontend. Returns the logged-in
// user's id and email.
router.get('/', requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
  })
})

export default router
