import type { LucideIcon } from 'lucide-react'
import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Pencil,
  Sparkles,
  Sprout,
} from 'lucide-react'
import type { StageId } from '../types'

/** 图标配置：后续上传资源后，把 customSrc 改成图片路径即可 */
export interface IconConfig {
  emoji: string
  customSrc: string | null
  lucide: LucideIcon
}

export const STAGE_ICONS: Record<StageId, IconConfig> = {
  primary: { emoji: '🌱', customSrc: null, lucide: Sprout },
  middle: { emoji: '📚', customSrc: null, lucide: BookOpen },
  high: { emoji: '✏️', customSrc: null, lucide: Pencil },
  college: { emoji: '🎓', customSrc: null, lucide: GraduationCap },
  graduate: { emoji: '📖', customSrc: null, lucide: BookMarked },
  future: { emoji: '🌟', customSrc: null, lucide: Sparkles },
}

export const APP_ICONS = {
  logo: { emoji: '🎓', customSrc: null as string | null },
  profile: { emoji: '👤', customSrc: null as string | null },
  emptyMemory: { emoji: '📷', customSrc: null as string | null },
}

export function getStageIcon(stageId: StageId): IconConfig {
  return STAGE_ICONS[stageId]
}
