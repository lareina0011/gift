import fs from 'node:fs'
import { Router } from 'express'
import multer from 'multer'
import { isValidStageId } from '../config.js'
import {
  deleteMediaByKey,
  generateId,
  getSettingMedia,
  replaceSettingMedia,
} from '../db.js'
import { optionalAuth, requireAuth, requireEditor } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

function sendSettingMedia(
  res: import('express').Response,
  category: string,
  settingKey: string,
  owner: string | null,
): void {
  const media = getSettingMedia(category, settingKey, owner)
  if (!media || !fs.existsSync(media.file_path)) {
    res.status(404).json({ error: '未设置' })
    return
  }
  res.setHeader('Content-Type', media.mime_type)
  res.setHeader('Cache-Control', 'private, max-age=3600')
  fs.createReadStream(media.file_path).pipe(res)
}

router.get('/background/:type', optionalAuth, (req, res) => {
  const type = req.params.type
  if (type !== 'login' && type !== 'hero') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  sendSettingMedia(res, 'background', type, null)
})

router.put('/background/:type', requireEditor, upload.single('file'), handleBackgroundUpload)
router.post('/background/:type', requireEditor, upload.single('file'), handleBackgroundUpload)

function handleBackgroundUpload(req: import('express').Request, res: import('express').Response): void {
  const type = req.params.type
  if (type !== 'login' && type !== 'hero') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  if (!req.file) {
    res.status(400).json({ error: '请上传文件' })
    return
  }

  const blobKey = generateId()
  replaceSettingMedia('background', type, null, blobKey, req.file.originalname, req.file.mimetype, req.file.buffer)
  res.json({ blobKey })
}

router.delete('/background/:type', requireEditor, (req, res) => {
  const type = req.params.type
  if (type !== 'login' && type !== 'hero') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  const media = getSettingMedia('background', type, null)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

router.get('/intro/:type', optionalAuth, (req, res) => {
  const type = req.params.type
  if (type !== 'image' && type !== 'audio') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  sendSettingMedia(res, 'intro', type, null)
})

router.put('/intro/:type', requireEditor, upload.single('file'), handleIntroUpload)
router.post('/intro/:type', requireEditor, upload.single('file'), handleIntroUpload)

function handleIntroUpload(req: import('express').Request, res: import('express').Response): void {
  const type = req.params.type
  if (type !== 'image' && type !== 'audio') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  if (!req.file) {
    res.status(400).json({ error: '请上传文件' })
    return
  }

  const blobKey = generateId()
  replaceSettingMedia('intro', type, null, blobKey, req.file.originalname, req.file.mimetype, req.file.buffer)
  res.json({ blobKey })
}

router.delete('/intro/:type', requireEditor, (req, res) => {
  const type = req.params.type
  if (type !== 'image' && type !== 'audio') {
    res.status(400).json({ error: '无效类型' })
    return
  }
  const media = getSettingMedia('intro', type, null)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

router.get('/avatar/:username', optionalAuth, (req, res) => {
  sendSettingMedia(res, 'avatar', 'avatar', String(req.params.username))
})

router.put('/avatar', requireAuth, upload.single('file'), handleAvatarUpload)
router.post('/avatar', requireAuth, upload.single('file'), handleAvatarUpload)

function handleAvatarUpload(req: import('express').Request, res: import('express').Response): void {
  if (!req.file) {
    res.status(400).json({ error: '请上传文件' })
    return
  }

  const username = req.user!.username
  const blobKey = generateId()
  replaceSettingMedia('avatar', 'avatar', username, blobKey, req.file.originalname, req.file.mimetype, req.file.buffer)
  res.json({ blobKey })
}

router.delete('/avatar', requireAuth, (req, res) => {
  const media = getSettingMedia('avatar', 'avatar', req.user!.username)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

router.get('/stage-bg/:stageId', optionalAuth, (req, res) => {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  sendSettingMedia(res, 'stage_bg', stageId, null)
})

router.put('/stage-bg/:stageId', requireEditor, upload.single('file'), handleStageBgUpload)
router.post('/stage-bg/:stageId', requireEditor, upload.single('file'), handleStageBgUpload)

function handleStageBgUpload(req: import('express').Request, res: import('express').Response): void {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  if (!req.file) {
    res.status(400).json({ error: '请上传文件' })
    return
  }
  if (!req.file.mimetype.startsWith('image/')) {
    res.status(400).json({ error: '仅支持图片' })
    return
  }
  const blobKey = generateId()
  replaceSettingMedia(
    'stage_bg',
    stageId,
    null,
    blobKey,
    req.file.originalname,
    req.file.mimetype,
    req.file.buffer,
  )
  res.json({ blobKey })
}

router.delete('/stage-bg/:stageId', requireEditor, (req, res) => {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  const media = getSettingMedia('stage_bg', stageId, null)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

router.get('/stage-icon/:stageId', optionalAuth, (req, res) => {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  sendSettingMedia(res, 'stage_icon', stageId, null)
})

router.put('/stage-icon/:stageId', requireEditor, upload.single('file'), handleStageIconUpload)
router.post('/stage-icon/:stageId', requireEditor, upload.single('file'), handleStageIconUpload)

function handleStageIconUpload(
  req: import('express').Request,
  res: import('express').Response,
): void {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  if (!req.file) {
    res.status(400).json({ error: '请上传文件' })
    return
  }
  if (!req.file.mimetype.startsWith('image/')) {
    res.status(400).json({ error: '仅支持图片' })
    return
  }
  const blobKey = generateId()
  replaceSettingMedia(
    'stage_icon',
    stageId,
    null,
    blobKey,
    req.file.originalname,
    req.file.mimetype,
    req.file.buffer,
  )
  res.json({ blobKey })
}

router.delete('/stage-icon/:stageId', requireEditor, (req, res) => {
  const stageId = String(req.params.stageId)
  if (!isValidStageId(stageId)) {
    res.status(400).json({ error: '无效阶段' })
    return
  }
  const media = getSettingMedia('stage_icon', stageId, null)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

router.get('/bgm', optionalAuth, (_req, res) => {
  sendSettingMedia(res, 'bgm', 'bgm', null)
})

router.put('/bgm', requireEditor, upload.single('file'), handleBgmUpload)
router.post('/bgm', requireEditor, upload.single('file'), handleBgmUpload)

function handleBgmUpload(req: import('express').Request, res: import('express').Response): void {
  if (!req.file) {
    res.status(400).json({ error: '请上传音频文件' })
    return
  }
  if (!req.file.mimetype.startsWith('audio/')) {
    res.status(400).json({ error: '仅支持音频文件' })
    return
  }
  const blobKey = generateId()
  replaceSettingMedia(
    'bgm',
    'bgm',
    null,
    blobKey,
    req.file.originalname,
    req.file.mimetype,
    req.file.buffer,
  )
  res.json({ blobKey })
}

router.delete('/bgm', requireEditor, (_req, res) => {
  const media = getSettingMedia('bgm', 'bgm', null)
  if (media) deleteMediaByKey(media.blob_key)
  res.json({ ok: true })
})

export default router
