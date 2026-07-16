import type { StageId } from '../types'
import seniorHighBg from '../assets/seniorhigh_school.png'
import postgraduateBg from '../assets/postgraduate_background.jpg'
import universityBg from '../assets/university_background.jpg'

export type StageBackgroundFit = 'cover' | 'contain'

export interface StageBackgroundStyle {
  fit: StageBackgroundFit
  position?: string
}

/** 各阶段专属背景；未配置的阶段沿用全局封面图 */
export const STAGE_BACKGROUNDS: Partial<Record<StageId, string>> = {
  high: seniorHighBg,
  college: universityBg,
  graduate: postgraduateBg,
}

/** 各阶段背景展示方式；竖图等需完整展示时可设为 contain */
export const STAGE_BACKGROUND_STYLES: Partial<Record<StageId, StageBackgroundStyle>> = {
  college: { fit: 'contain', position: 'center center' },
}

export function getStageBackground(stageId: StageId): string | null {
  return STAGE_BACKGROUNDS[stageId] ?? null
}

export function getStageBackgroundStyle(stageId: StageId): StageBackgroundStyle {
  return STAGE_BACKGROUND_STYLES[stageId] ?? { fit: 'cover', position: 'center center' }
}
