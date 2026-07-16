import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { DATA_DIR, DB_PATH, DEFAULT_USERS, UPLOADS_DIR } from './config.js'

export interface DbUser {
  id: number
  username: string
  password_hash: string
  role: string
  created_at: string
}

export interface DbMemory {
  id: string
  stage_id: string
  title: string
  content: string
  date: string
  created_at: string
  unlock_at: string | null
  owner: string | null
}

export interface DbSiteLetter {
  id: string
  title: string
  body: string
  updated_at: string
}

export interface DbLetterVoice {
  id: string
  blob_key: string
  label: string
  sort_order: number
  created_at: string
}

export interface DbMemoryMedia {
  id: string
  memory_id: string
  type: string
  name: string
  blob_key: string
  sort_order: number
}

export interface DbWish {
  id: string
  text: string
  emoji: string
  created_at: string
}

export interface DbMediaFile {
  blob_key: string
  filename: string
  mime_type: string
  file_path: string
  category: string
  owner: string | null
  setting_key: string | null
  created_at: string
}

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export function initDb(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      stage_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memory_media (
      id TEXT PRIMARY KEY,
      memory_id TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      blob_key TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_files (
      blob_key TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      category TEXT NOT NULL,
      owner TEXT,
      setting_key TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stage_blessings (
      id TEXT PRIMARY KEY,
      stage_id TEXT NOT NULL,
      friend_name TEXT NOT NULL DEFAULT '',
      caption TEXT NOT NULL DEFAULT '',
      blob_key TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_letters (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS letter_voices (
      id TEXT PRIMARY KEY,
      blob_key TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `)

  migrateMemoryUnlockAt()
  migrateMemoryOwner()
  seedLetter()
  seedUsers()
}

function migrateMemoryUnlockAt(): void {
  const cols = db.prepare(`PRAGMA table_info(memories)`).all() as Array<{ name: string }>
  if (!cols.some((c) => c.name === 'unlock_at')) {
    db.exec(`ALTER TABLE memories ADD COLUMN unlock_at TEXT`)
  }
}

/** 回忆按账号隔离：历史数据默认归 lareina，避免影响 viewer 空状态 */
function migrateMemoryOwner(): void {
  const cols = db.prepare(`PRAGMA table_info(memories)`).all() as Array<{ name: string }>
  if (!cols.some((c) => c.name === 'owner')) {
    db.exec(`ALTER TABLE memories ADD COLUMN owner TEXT`)
    db.exec(`UPDATE memories SET owner = 'lareina' WHERE owner IS NULL`)
    db.exec(`
      UPDATE media_files
      SET owner = (
        SELECT m.owner FROM memories m
        INNER JOIN memory_media mm ON mm.memory_id = m.id
        WHERE mm.blob_key = media_files.blob_key
      )
      WHERE category = 'memory' AND owner IS NULL
    `)
  }
}

function seedLetter(): void {
  const existing = db.prepare(`SELECT id FROM site_letters LIMIT 1`).get() as { id: string } | undefined
  if (existing) return
  db.prepare(
    `INSERT INTO site_letters (id, title, body, updated_at) VALUES (?, ?, ?, ?)`,
  ).run(
    'default',
    '写给你的一封信',
    '亲爱的你：\n\n愿这一本里的细碎时光，都能陪你走到讲台上那束温柔的光。\n\n—— 拾光录',
    new Date().toISOString(),
  )
}

export interface DbStageBlessing {
  id: string
  stage_id: string
  friend_name: string
  caption: string
  blob_key: string
  sort_order: number
  created_at: string
}

function seedUsers(): void {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (username, password_hash, role)
    VALUES (@username, @password_hash, @role)
  `)
  const syncRole = db.prepare(`
    UPDATE users SET role = @role WHERE username = @username
  `)

  for (const user of DEFAULT_USERS) {
    insert.run({
      username: user.username,
      password_hash: bcrypt.hashSync(user.password, 10),
      role: user.role,
    })
    syncRole.run({
      username: user.username,
      role: user.role,
    })
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function saveUploadedFile(
  blobKey: string,
  originalName: string,
  mimeType: string,
  buffer: Buffer,
  category: string,
  owner: string | null = null,
  settingKey: string | null = null,
): string {
  const ext = path.extname(originalName) || ''
  const filePath = path.join(UPLOADS_DIR, `${blobKey}${ext}`)
  fs.writeFileSync(filePath, buffer)

  getDb()
    .prepare(
      `INSERT INTO media_files (blob_key, filename, mime_type, file_path, category, owner, setting_key)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(blobKey, originalName, mimeType, filePath, category, owner, settingKey)

  return filePath
}

export function replaceSettingMedia(
  category: string,
  settingKey: string,
  owner: string | null,
  blobKey: string,
  originalName: string,
  mimeType: string,
  buffer: Buffer,
): string {
  const existing = getDb()
    .prepare(
      `SELECT blob_key, file_path FROM media_files
       WHERE category = ? AND setting_key = ?
         AND ((? IS NULL AND owner IS NULL) OR owner = ?)`,
    )
    .all(category, settingKey, owner, owner) as Array<{ blob_key: string; file_path: string }>

  for (const row of existing) {
    deleteMediaByKey(row.blob_key)
  }

  return saveUploadedFile(blobKey, originalName, mimeType, buffer, category, owner, settingKey)
}

export function getMediaByKey(blobKey: string): DbMediaFile | undefined {
  return getDb()
    .prepare('SELECT * FROM media_files WHERE blob_key = ?')
    .get(blobKey) as DbMediaFile | undefined
}

export function deleteMediaByKey(blobKey: string): void {
  const row = getMediaByKey(blobKey)
  if (!row) return

  if (fs.existsSync(row.file_path)) {
    fs.unlinkSync(row.file_path)
  }
  getDb().prepare('DELETE FROM media_files WHERE blob_key = ?').run(blobKey)
}

export function getSettingMedia(
  category: string,
  settingKey: string,
  owner: string | null = null,
): DbMediaFile | undefined {
  return getDb()
    .prepare(
      `SELECT * FROM media_files
       WHERE category = ? AND setting_key = ?
         AND ((? IS NULL AND owner IS NULL) OR owner = ?)
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(category, settingKey, owner, owner) as DbMediaFile | undefined
}
