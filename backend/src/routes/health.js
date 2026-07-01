import { Router } from 'express'

const router = Router()

// GET /api/health — used by the frontend skeleton and uptime checks to
// confirm the backend is reachable and responding.
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'second-brain-ai-backend',
    timestamp: new Date().toISOString(),
  })
})

export default router
