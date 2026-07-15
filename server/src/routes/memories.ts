import { Router } from 'express'
import multer from 'multer'
import { deleteMediaByKey, generateId, getDb, saveUploadedFile } from '../db.js'
import { requireAuth, requireEditor } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

type MemoryRow = {
  id: string
  stage_id: string
  title: string
  content: string
  date: string
  created_at: string
  unlock_at: string | null
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function isLocked(unlockAt: string | null | undefined): boolean {
  if (!unlockAt) return false
  return unlockAt > todayDate()
}

function normalizeUnlockAt(value: unknown, fallback: string | null): string | null {
  if (value === undefined) return fallback
  if (value === null || value === '') return null
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return fallback
  return trimmed
}

function getMemoryJson(memoryId: string) {
  const m = getDb().prepare('SELECT * FROM memories WHERE id = ?').get(memoryId) as MemoryRow | undefined
  if (!m) return null

  const locked = isLocked(m.unlock_at)
  if (locked) {
    return {
      id: m.id,
      stageId: m.stage_id,
      title: m.title,
      content: '',
      date: m.date,
      createdAt: m.created_at,
      unlockAt: m.unlock_at,
      locked: true,
      media: [] as Array<{ id: string; type: string; name: string; blobKey: string }>,
    }
  }

  const media = (
    getDb()
      .prepare(
        'SELECT id, type, name, blob_key FROM memory_media WHERE memory_id = ? ORDER BY sort_order ASC',
      )
      .all(m.id) as Array<{ id: string; type: string; name: string; blob_key: string }>
  ).map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    blobKey: item.blob_key,
  }))

  return {
    id: m.id,
    stageId: m.stage_id,
    title: m.title,
    content: m.content,
    date: m.date,
    createdAt: m.created_at,
    unlockAt: m.unlock_at,
    locked: false,
    media,
  }
}

/** editor 编辑时需要看到真实内容 */
function getMemoryJsonFull(memoryId: string) {
  const m = getDb().prepare('SELECT * FROM memories WHERE id = ?').get(memoryId) as MemoryRow | undefined
  if (!m) return null

  const media = (
    getDb()
      .prepare(
        'SELECT id, type, name, blob_key FROM memory_media WHERE memory_id = ? ORDER BY sort_order ASC',
      )
      .all(m.id) as Array<{ id: string; type: string; name: string; blob_key: string }>
  ).map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    blobKey: item.blob_key,
  }))

  return {
    id: m.id,
    stageId: m.stage_id,
    title: m.title,
    content: m.content,
    date: m.date,
    createdAt: m.created_at,
    unlockAt: m.unlock_at,
    locked: isLocked(m.unlock_at),
    media,
  }
}

router.get('/', requireAuth, (req, res) => {
  const memories = getDb()
    .prepare('SELECT id FROM memories ORDER BY created_at DESC')
    .all() as Array<{ id: string }>

  const full = req.user?.role === 'editor'
  res.json(
    memories
      .map((m) => (full ? getMemoryJsonFull(m.id) : getMemoryJson(m.id)))
      .filter(Boolean),
  )
})

router.post('/', requireEditor, upload.array('files'), (req, res) => {
  const { stageId, title, content, date } = req.body as {
    stageId?: string
    title?: string
    content?: string
    date?: string
  }
  const unlockAt = normalizeUnlockAt(req.body.unlockAt, null)

  if (!stageId || !title?.trim() || !date) {
    res.status(400).json({ error: '缺少必要字段' })
    return
  }

  const memoryId = generateId()
  const createdAt = new Date().toISOString()

  getDb()
    .prepare(
      `INSERT INTO memories (id, stage_id, title, content, date, created_at, unlock_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(memoryId, stageId, title.trim(), content ?? '', date, createdAt, unlockAt)

  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  files.forEach((file, index) => {
    const blobKey = generateId()
    const mediaId = generateId()
    const type = file.mimetype.startsWith('video/') ? 'video' : 'image'

    saveUploadedFile(blobKey, file.originalname, file.mimetype, file.buffer, 'memory')

    getDb()
      .prepare(
        `INSERT INTO memory_media (id, memory_id, type, name, blob_key, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(mediaId, memoryId, type, file.originalname, blobKey, index)
  })

  res.status(201).json(getMemoryJsonFull(memoryId))
})

router.patch('/:id', requireEditor, upload.array('files'), (req, res) => {
  const id = String(req.params.id)
  const existing = getDb().prepare('SELECT * FROM memories WHERE id = ?').get(id) as
    | MemoryRow
    | undefined

  if (!existing) {
    res.status(404).json({ error: '回忆不存在' })
    return
  }

  const title =
    typeof req.body.title === 'string' ? req.body.title.trim() : existing.title
  const content =
    typeof req.body.content === 'string' ? req.body.content : existing.content
  const date = typeof req.body.date === 'string' ? req.body.date : existing.date
  const unlockAt = normalizeUnlockAt(req.body.unlockAt, existing.unlock_at)

  if (!title || !date) {
    res.status(400).json({ error: '缺少必要字段' })
    return
  }

  getDb()
    .prepare(`UPDATE memories SET title = ?, content = ?, date = ?, unlock_at = ? WHERE id = ?`)
    .run(title, content, date, unlockAt, id)

  let removeIds: string[] = []
  if (typeof req.body.removeMediaIds === 'string' && req.body.removeMediaIds.trim()) {
    try {
      const parsed = JSON.parse(req.body.removeMediaIds) as unknown
      if (Array.isArray(parsed)) {
        removeIds = parsed.map(String)
      }
    } catch {
      res.status(400).json({ error: 'removeMediaIds 格式无效' })
      return
    }
  }

  for (const mediaId of removeIds) {
    const row = getDb()
      .prepare('SELECT blob_key FROM memory_media WHERE id = ? AND memory_id = ?')
      .get(mediaId, id) as { blob_key: string } | undefined
    if (!row) continue
    getDb().prepare('DELETE FROM memory_media WHERE id = ?').run(mediaId)
    deleteMediaByKey(row.blob_key)
  }

  const maxSort = getDb()
    .prepare(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM memory_media WHERE memory_id = ?`)
    .get(id) as { m: number }

  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  files.forEach((file, index) => {
    const blobKey = generateId()
    const mediaId = generateId()
    const type = file.mimetype.startsWith('video/') ? 'video' : 'image'

    saveUploadedFile(blobKey, file.originalname, file.mimetype, file.buffer, 'memory')

    getDb()
      .prepare(
        `INSERT INTO memory_media (id, memory_id, type, name, blob_key, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(mediaId, id, type, file.originalname, blobKey, maxSort.m + 1 + index)
  })

  res.json(getMemoryJsonFull(id))
})

router.delete('/:id', requireEditor, (req, res) => {
  const id = String(req.params.id)
  const memory = getDb()
    .prepare('SELECT id FROM memories WHERE id = ?')
    .get(id) as { id: string } | undefined

  if (!memory) {
    res.status(404).json({ error: '回忆不存在' })
    return
  }

  const mediaRows = getDb()
    .prepare('SELECT blob_key FROM memory_media WHERE memory_id = ?')
    .all(memory.id) as Array<{ blob_key: string }>

  for (const row of mediaRows) {
    deleteMediaByKey(row.blob_key)
  }

  getDb().prepare('DELETE FROM memories WHERE id = ?').run(memory.id)
  res.json({ ok: true })
})

export default router
