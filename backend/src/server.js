// Must be the very first import. ES module imports all execute before the
// rest of the file body runs, so a later `dotenv.config()` call would fire
// too late — after other imported modules (like supabaseClient.js) have
// already read process.env and found it empty.
import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'
import meRouter from './routes/me.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/me', meRouter)

// Placeholder routes for upcoming steps — not implemented yet.
// app.use('/api/gmail', gmailRouter)
// app.use('/api/chat', chatRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Second Brain AI backend running on http://localhost:${PORT}`)
})