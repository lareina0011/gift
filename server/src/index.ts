import cors from 'cors'
import express from 'express'
import { initDb } from './db.js'
import { PORT } from './config.js'
import authRoutes from './routes/auth.js'
import memoriesRoutes from './routes/memories.js'
import wishesRoutes from './routes/wishes.js'
import mediaRoutes from './routes/media.js'
import settingsRoutes from './routes/settings.js'

initDb()

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/wishes', wishesRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/settings', settingsRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
