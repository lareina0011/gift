import { Router } from 'express'
import { generateId, getDb } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, (_req, res) => {
  const wishes = getDb()
    .prepare('SELECT * FROM wishes ORDER BY created_at DESC')
    .all() as Array<{ id: string; text: string; emoji: string; created_at: string }>

  res.json(
    wishes.map((w) => ({
      id: w.id,
      text: w.text,
      emoji: w.emoji,
      createdAt: w.created_at,
    })),
  )
})

router.post('/', requireAuth, (req, res) => {
  const { text, emoji } = req.body as { text?: string; emoji?: string }
  if (!text?.trim() || !emoji) {
    res.status(400).json({ error: '缺少必要字段' })
    return
  }

  const id = generateId()
  const createdAt = new Date().toISOString()

  getDb()
    .prepare('INSERT INTO wishes (id, text, emoji, created_at) VALUES (?, ?, ?, ?)')
    .run(id, text.trim(), emoji, createdAt)

  res.status(201).json({ id, text: text.trim(), emoji, createdAt })
})

router.delete('/:id', requireAuth, (req, res) => {
  const result = getDb().prepare('DELETE FROM wishes WHERE id = ?').run(req.params.id)
  if (result.changes === 0) {
    res.status(404).json({ error: '愿望不存在' })
    return
  }
  res.json({ ok: true })
})

export default router
