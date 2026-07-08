import type { StageId } from '../types'

export interface StageInfo {
  id: StageId
  label: string
  shortLabel: string
  progress: number
  emoji: string
  quote: string
  description: string
  gradient: string
  accent: string
}

export const STAGES: StageInfo[] = [
  {
    id: 'primary',
    label: '小学',
    shortLabel: '小学',
    progress: 0,
    emoji: '🌱',
    quote: '初识世界的奇妙，一笔一画写下童年。',
    description: '那些背着小书包的日子，是梦想最初的形状。',
    gradient: 'from-emerald-400/20 to-teal-300/10',
    accent: '#34d399',
  },
  {
    id: 'middle',
    label: '初中',
    shortLabel: '初中',
    progress: 20,
    emoji: '📚',
    quote: '少年意气，在书页与操场之间生长。',
    description: '开始懂得坚持，也开始遇见更辽阔的自己。',
    gradient: 'from-sky-400/20 to-blue-300/10',
    accent: '#38bdf8',
  },
  {
    id: 'high',
    label: '高中',
    shortLabel: '高中',
    progress: 40,
    emoji: '✏️',
    quote: '挑灯夜读，为远方蓄力。',
    description: '紧张与热血交织，每一次考试都是向未来的投递。',
    gradient: 'from-violet-400/20 to-purple-300/10',
    accent: '#a78bfa',
  },
  {
    id: 'college',
    label: '大学',
    shortLabel: '大学',
    progress: 60,
    emoji: '🎓',
    quote: '自由探索，在热爱里找到方向。',
    description: '社团、实验、旅行——世界忽然变得很大很大。',
    gradient: 'from-rose-400/20 to-pink-300/10',
    accent: '#fb7185',
  },
  {
    id: 'graduate',
    label: '研究生',
    shortLabel: '研究生',
    progress: 80,
    emoji: '🔬',
    quote: '深耕一隅，向未知追问。',
    description: '在文献与实验之间，把好奇变成专业与洞见。',
    gradient: 'from-amber-400/20 to-orange-300/10',
    accent: '#fbbf24',
  },
  {
    id: 'future',
    label: '未来',
    shortLabel: '未来',
    progress: 100,
    emoji: '🌟',
    quote: '前方有光，故事还在继续。',
    description: '毕业不是终点，而是下一段精彩旅程的起点。',
    gradient: 'from-fuchsia-400/20 to-indigo-300/10',
    accent: '#e879f9',
  },
]

export function getStageById(id: StageId): StageInfo {
  return STAGES.find((s) => s.id === id) ?? STAGES[0]
}
