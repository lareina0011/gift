import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export interface AuthPayload {
  userId: number
  username: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未登录' })
    return
  }

  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, JWT_SECRET) as AuthPayload
    next()
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' })
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const queryToken = typeof req.query.token === 'string' ? req.query.token : null
  const raw = header?.startsWith('Bearer ') ? header.slice(7) : queryToken

  if (raw) {
    try {
      req.user = jwt.verify(raw, JWT_SECRET) as AuthPayload
    } catch {
      // ignore invalid token
    }
  }
  next()
}

/** 仅开发账号（lareina / editor）可写内容 */
export function requireEditor(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'editor') {
      res.status(403).json({ error: '仅开发账号可进行此操作' })
      return
    }
    next()
  })
}
