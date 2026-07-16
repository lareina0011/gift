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

  if (
    (media.category === 'memory' ||
      media.category === 'stage_blessing' ||
      media.category === 'letter_voice') &&
    !req.user
  ) {
    res.status(401).json({ error: '未登录' })
    return
  }

  if (media.category === 'memory' && media.owner && media.owner !== req.user?.username) {
    res.status(403).json({ error: '无权访问' })
    return
  }

  const stat = fs.statSync(media.file_path)
  const range = req.headers.range
  res.setHeader('Content-Type', media.mime_type)
  res.setHeader('Cache-Control', 'private, max-age=3600')
  res.setHeader('Accept-Ranges', 'bytes')

  if (range) {
    const match = /bytes=(\d+)-(\d*)/.exec(range)
    if (match) {
      const start = Number(match[1])
      const end = match[2] ? Number(match[2]) : stat.size - 1
      if (start >= stat.size || end >= stat.size || start > end) {
        res.status(416).setHeader('Content-Range', `bytes */${stat.size}`).end()
        return
      }
      res.status(206)
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`)
      res.setHeader('Content-Length', end - start + 1)
      fs.createReadStream(media.file_path, { start, end }).pipe(res)
      return
    }
  }

  res.setHeader('Content-Length', stat.size)
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
