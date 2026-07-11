import { Router } from 'express'
import multer from 'multer'
import { deleteMediaByKey, generateId, getDb, saveUploadedFile } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

router.get('/', requireAuth, (_req, res) => {
  const memories = getDb()
    .prepare('SELECT * FROM memories ORDER BY created_at DESC')
    .all() as Array<{
    id: string
    stage_id: string
    title: string
    content: string
    date: string
    created_at: string
  }>

  const mediaStmt = getDb().prepare(
    'SELECT id, type, name, blob_key FROM memory_media WHERE memory_id = ? ORDER BY sort_order ASC',
  )

  res.json(
    memories.map((m) => ({
      id: m.id,
      stageId: m.stage_id,
      title: m.title,
      content: m.content,
      date: m.date,
      createdAt: m.created_at,
      media: (mediaStmt.all(m.id) as Array<{
        id: string
        type: string
        name: string
        blob_key: string
      }>).map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        blobKey: item.blob_key,
      })),
    })),
  )
})

router.post('/', requireAuth, upload.array('files'), (req, res) => {
  const { stageId, title, content, date } = req.body as {
    stageId?: string
    title?: string
    content?: string
    date?: string
  }

  if (!stageId || !title?.trim() || !date) {
    res.status(400).json({ error: '缺少必要字段' })
    return
  }

  const memoryId = generateId()
  const createdAt = new Date().toISOString()

  getDb()
    .prepare(
      `INSERT INTO memories (id, stage_id, title, content, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(memoryId, stageId, title.trim(), content ?? '', date, createdAt)

  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  const mediaItems = files.map((file, index) => {
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

    return { id: mediaId, type, name: file.originalname, blobKey }
  })

  res.status(201).json({
    id: memoryId,
    stageId,
    title: title.trim(),
    content: content ?? '',
    date,
    createdAt,
    media: mediaItems,
  })
})

router.delete('/:id', requireAuth, (req, res) => {
  const memory = getDb()
    .prepare('SELECT id FROM memories WHERE id = ?')
    .get(req.params.id) as { id: string } | undefined

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
