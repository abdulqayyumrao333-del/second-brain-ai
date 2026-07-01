import crypto from 'crypto'

const STATE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const store = new Map()

export function createState(userId) {
  const state = crypto.randomBytes(24).toString('hex')
  store.set(state, { userId, expiresAt: Date.now() + STATE_TTL_MS })
  return state
}

export function consumeState(state) {
  const entry = store.get(state)
  if (!entry) return null

  store.delete(state)

  if (Date.now() > entry.expiresAt) return null

  return entry.userId
}