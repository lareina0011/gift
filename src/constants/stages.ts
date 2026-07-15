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
    quote: '挑灯夜读，心中渐渐亮起教书育人的光。',
    description: '紧张与热血交织，每一次努力都是向理想讲台的靠近。',
    gradient: 'from-violet-400/20 to-purple-300/10',
    accent: '#a78bfa',
  },
  {
    id: 'college',
    label: '大学',
    shortLabel: '大学',
    progress: 60,
    emoji: '🎓',
    quote: '在思想的旷野里，慢慢长成自己的样子。',
    description: '课堂、见习、志愿与社团——世界忽然变得很大很大。',
    gradient: 'from-rose-400/20 to-pink-300/10',
    accent: '#fb7185',
  },
  {
    id: 'graduate',
    label: '研究生',
    shortLabel: '研究生',
    progress: 80,
    emoji: '📖',
    quote: '读得更深，也把所学练成能讲、能传的力量。',
    description: '遇到奇奇怪怪的导师，经历着奇奇怪怪的事，刷新人生全新体验哈哈哈哈哈。',
    gradient: 'from-amber-400/20 to-orange-300/10',
    accent: '#fbbf24',
  },
  {
    id: 'future',
    label: '未来',
    shortLabel: '未来',
    progress: 100,
    emoji: '🌟',
    quote: '愿你站上讲台，把温柔与信念交给下一代。',
    description: '毕业不是终点，而是成为一名好老师的开始。',
    gradient: 'from-fuchsia-400/20 to-indigo-300/10',
    accent: '#e879f9',
  },
]

export function getStageById(id: StageId): StageInfo {
  return STAGES.find((s) => s.id === id) ?? STAGES[0]
}
