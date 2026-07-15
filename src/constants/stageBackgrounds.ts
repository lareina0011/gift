import type { StageId } from '../types'
import seniorHighBg from '../assets/seniorhigh_school.png'

/** 各阶段专属背景；未配置的阶段沿用全局封面图 */
export const STAGE_BACKGROUNDS: Partial<Record<StageId, string>> = {
  high: seniorHighBg,
}

export function getStageBackground(stageId: StageId): string | null {
  return STAGE_BACKGROUNDS[stageId] ?? null
}
