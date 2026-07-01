import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'
import meRouter from './routes/me.js'
import gmailRouter from './routes/gmail.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/me', meRouter)
app.use('/api/gmail', gmailRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Second Brain AI backend running on http://localhost:${PORT}`)
})