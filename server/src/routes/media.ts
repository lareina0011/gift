import fs from 'node:fs'
import { Router } from 'express'
import { deleteMediaByKey, getMediaByKey } from '../db.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/:key', optionalAuth, (req, res) => {
  const key = String(req.params.key)
  const media = getMediaByKey(key)
  if (!media || !fs.existsSync(media.file_path)) {
    res.status(404).json({ error: '文件不存在' })
    return
  }

  if (media.category === 'memory' && !req.user) {
    res.status(401).json({ error: '未登录' })
    return
  }

  res.setHeader('Content-Type', media.mime_type)
  res.setHeader('Cache-Control', 'private, max-age=3600')
  fs.createReadStream(media.file_path).pipe(res)
})

router.delete('/:key', requireAuth, (req, res) => {
  const key = String(req.params.key)
  const media = getMediaByKey(key)
  if (!media) {
    res.status(404).json({ error: '文件不存在' })
    return
  }

  deleteMediaByKey(key)
  res.json({ ok: true })
})

export default router
