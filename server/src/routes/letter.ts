import { Router } from 'express'
import multer from 'multer'
import {
  deleteMediaByKey,
  generateId,
  getDb,
  saveUploadedFile,
  type DbLetterVoice,
  type DbSiteLetter,
} from '../db.js'
import { requireAuth, requireEditor } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
})

function getLetter(): DbSiteLetter {
  const row = getDb().prepare(`SELECT * FROM site_letters LIMIT 1`).get() as DbSiteLetter | undefined
  if (row) return row
  const now = new Date().toISOString()
  getDb()
    .prepare(`INSERT INTO site_letters (id, title, body, updated_at) VALUES (?, ?, ?, ?)`)
    .run('default', '写给你的一封信', '', now)
  return getDb().prepare(`SELECT * FROM site_letters LIMIT 1`).get() as DbSiteLetter
}

function mapVoice(row: DbLetterVoice) {
  return {
    id: row.id,
    blobKey: row.blob_key,
    label: row.label,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

router.get('/', requireAuth, (_req, res) => {
  const letter = getLetter()
  const voices = getDb()
    .prepare(`SELECT * FROM letter_voices ORDER BY sort_order ASC, created_at ASC`)
    .all() as DbLetterVoice[]

  res.json({
    id: letter.id,
    title: letter.title,
    body: letter.body,
    updatedAt: letter.updated_at,
    voices: voices.map(mapVoice),
  })
})

router.put('/', requireEditor, (req, res) => {
  const letter = getLetter()
  const title =
    typeof req.body.title === 'string' ? req.body.title.trim().slice(0, 80) : letter.title
  const body = typeof req.body.body === 'string' ? req.body.body.slice(0, 20000) : letter.body
  const updatedAt = new Date().toISOString()

  getDb()
    .prepare(`UPDATE site_letters SET title = ?, body = ?, updated_at = ? WHERE id = ?`)
    .run(title, body, updatedAt, letter.id)

  const voices = getDb()
    .prepare(`SELECT * FROM letter_voices ORDER BY sort_order ASC, created_at ASC`)
    .all() as DbLetterVoice[]

  res.json({
    id: letter.id,
    title,
    body,
    updatedAt,
    voices: voices.map(mapVoice),
  })
})

router.get('/voices', requireAuth, (_req, res) => {
  const voices = getDb()
    .prepare(`SELECT * FROM letter_voices ORDER BY sort_order ASC, created_at ASC`)
    .all() as DbLetterVoice[]
  res.json(voices.map(mapVoice))
})

router.post('/voices', requireEditor, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: '请上传音频文件' })
    return
  }
  if (!req.file.mimetype.startsWith('audio/')) {
    res.status(400).json({ error: '仅支持音频文件' })
    return
  }

  const label = String(req.body.label ?? '').trim().slice(0, 40)
  const maxSort = getDb()
    .prepare(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM letter_voices`)
    .get() as { m: number }

  const id = generateId()
  const blobKey = generateId()
  const createdAt = new Date().toISOString()
  const sortOrder = maxSort.m + 1

  saveUploadedFile(
    blobKey,
    req.file.originalname,
    req.file.mimetype,
    req.file.buffer,
    'letter_voice',
  )

  getDb()
    .prepare(
      `INSERT INTO letter_voices (id, blob_key, label, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, blobKey, label, sortOrder, createdAt)

  const row = getDb().prepare(`SELECT * FROM letter_voices WHERE id = ?`).get(id) as DbLetterVoice
  res.status(201).json(mapVoice(row))
})

router.delete('/voices/:id', requireEditor, (req, res) => {
  const id = String(req.params.id)
  const existing = getDb().prepare(`SELECT * FROM letter_voices WHERE id = ?`).get(id) as
    | DbLetterVoice
    | undefined

  if (!existing) {
    res.status(404).json({ error: '语音不存在' })
    return
  }

  getDb().prepare(`DELETE FROM letter_voices WHERE id = ?`).run(id)
  deleteMediaByKey(existing.blob_key)
  res.json({ ok: true })
})

export default router
