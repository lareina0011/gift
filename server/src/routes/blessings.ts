import { Router } from 'express'
import multer from 'multer'
import { isValidStageId } from '../config.js'
import {
  deleteMediaByKey,
  generateId,
  getDb,
  saveUploadedFile,
  type DbStageBlessing,
} from '../db.js'
import { requireAuth, requireEditor } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
})

function mapBlessing(row: DbStageBlessing) {
  return {
    id: row.id,
    stageId: row.stage_id,
    friendName: row.friend_name,
    caption: row.caption,
    blobKey: row.blob_key,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

router.get('/', requireAuth, (req, res) => {
  const stageId = typeof req.query.stageId === 'string' ? req.query.stageId : null
  if (stageId && !isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }

  const rows = (
    stageId
      ? getDb()
          .prepare(
            `SELECT * FROM stage_blessings WHERE stage_id = ? ORDER BY sort_order ASC, created_at ASC`,
          )
          .all(stageId)
      : getDb()
          .prepare(`SELECT * FROM stage_blessings ORDER BY stage_id ASC, sort_order ASC, created_at ASC`)
          .all()
  ) as DbStageBlessing[]

  res.json(rows.map(mapBlessing))
})

router.post('/', requireEditor, upload.single('file'), (req, res) => {
  const stageId = String(req.body.stageId ?? '')
  const friendName = String(req.body.friendName ?? '').trim().slice(0, 40)
  const caption = String(req.body.caption ?? '').trim().slice(0, 120)

  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  if (!req.file) {
    res.status(400).json({ error: '请上传视频文件' })
    return
  }
  if (!req.file.mimetype.startsWith('video/')) {
    res.status(400).json({ error: '仅支持视频文件' })
    return
  }

  const maxSort = getDb()
    .prepare(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM stage_blessings WHERE stage_id = ?`)
    .get(stageId) as { m: number }

  const id = generateId()
  const blobKey = generateId()
  const createdAt = new Date().toISOString()
  const sortOrder = maxSort.m + 1

  saveUploadedFile(
    blobKey,
    req.file.originalname,
    req.file.mimetype,
    req.file.buffer,
    'stage_blessing',
  )

  getDb()
    .prepare(
      `INSERT INTO stage_blessings (id, stage_id, friend_name, caption, blob_key, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, stageId, friendName, caption, blobKey, sortOrder, createdAt)

  const row = getDb().prepare('SELECT * FROM stage_blessings WHERE id = ?').get(id) as DbStageBlessing
  res.status(201).json(mapBlessing(row))
})

router.patch('/:id', requireEditor, (req, res) => {
  const id = String(req.params.id)
  const existing = getDb().prepare('SELECT * FROM stage_blessings WHERE id = ?').get(id) as
    | DbStageBlessing
    | undefined

  if (!existing) {
    res.status(404).json({ error: '寄语不存在' })
    return
  }

  const friendName =
    typeof req.body.friendName === 'string'
      ? req.body.friendName.trim().slice(0, 40)
      : existing.friend_name
  const caption =
    typeof req.body.caption === 'string'
      ? req.body.caption.trim().slice(0, 120)
      : existing.caption

  getDb()
    .prepare(`UPDATE stage_blessings SET friend_name = ?, caption = ? WHERE id = ?`)
    .run(friendName, caption, id)

  const row = getDb().prepare('SELECT * FROM stage_blessings WHERE id = ?').get(id) as DbStageBlessing
  res.json(mapBlessing(row))
})

router.delete('/:id', requireEditor, (req, res) => {
  const id = String(req.params.id)
  const existing = getDb().prepare('SELECT * FROM stage_blessings WHERE id = ?').get(id) as
    | DbStageBlessing
    | undefined

  if (!existing) {
    res.status(404).json({ error: '寄语不存在' })
    return
  }

  getDb().prepare('DELETE FROM stage_blessings WHERE id = ?').run(id)
  deleteMediaByKey(existing.blob_key)
  res.json({ ok: true })
})

export default router
