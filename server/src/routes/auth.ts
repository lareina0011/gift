import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getDb } from '../db.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string }
  if (!username?.trim() || !password) {
    res.status(400).json({ error: '请输入账号和密码' })
    return
  }

  const user = getDb()
    .prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?')
    .get(username.trim()) as
    | { id: number; username: string; password_hash: string; role: string }
    | undefined

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: '账号或密码不正确' })
    return
  }

  const token = signToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  })

  res.json({
    token,
    user: { username: user.username, role: user.role },
  })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({
    username: req.user!.username,
    role: req.user!.role,
  })
})

router.put('/password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body as {
    oldPassword?: string
    newPassword?: string
  }

  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: '请填写原密码和新密码' })
    return
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: '新密码至少 6 位' })
    return
  }

  const user = getDb()
    .prepare('SELECT id, password_hash FROM users WHERE id = ?')
    .get(req.user!.userId) as { id: number; password_hash: string } | undefined

  if (!user || !bcrypt.compareSync(oldPassword, user.password_hash)) {
    res.status(400).json({ error: '原密码不正确' })
    return
  }

  getDb()
    .prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    .run(bcrypt.hashSync(newPassword, 10), user.id)

  res.json({ message: '密码修改成功' })
})

export default router
