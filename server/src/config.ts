import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PORT = Number(process.env.PORT) || 3001
export const JWT_SECRET = process.env.JWT_SECRET || 'graduation-gift-dev-secret'
export const DATA_DIR = path.join(__dirname, '..', 'data')
export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')
export const DB_PATH = path.join(DATA_DIR, 'app.db')

/** editor = 开发/内容管理；viewer = 展示端（收礼人） */
export const DEFAULT_USERS = [
  { username: 'lareina', password: '20030621jjb', role: 'editor' as const },
  { username: 'lemon', password: '20021007', role: 'viewer' as const },
]

export const STAGE_IDS = [
  'primary',
  'middle',
  'high',
  'college',
  'graduate',
  'future',
] as const

export type StageId = (typeof STAGE_IDS)[number]

export function isValidStageId(value: string): value is StageId {
  return (STAGE_IDS as readonly string[]).includes(value)
}
