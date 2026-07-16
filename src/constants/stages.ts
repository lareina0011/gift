import type { StageId } from '../types'

export interface StageInfo {
  id: StageId
  label: string
  shortLabel: string
  progress: number
  emoji: string
  quote: string
  description: string
  /** Hero 封面：选中该阶段时展示 */
  heroTitle: string
  heroDescription: string
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
    heroTitle: '书包很轻，梦想刚开始发芽',
    heroDescription:
      '扎着马尾的小女孩，在田字格里写下第一个认真。日子不长，却已经足够温柔，值得收进这本拾光录里。',
    gradient: 'from-emerald-400/20 to-teal-300/10',
    accent: '#34d399',
  },
  {
    id: 'middle',
    label: '初中',
    shortLabel: '初中',
    progress: 20,
    emoji: '📚',
    quote: '城关的晨读声里，一个女孩悄悄长出了笃定。',
    description: '走出家门不远便是校门，最熟悉的钟声里，你开始学会为自己认真。',
    heroTitle: '城关中学，安静又发亮的年纪',
    heroDescription:
      '不大的校园，却装得下很多第一次：第一次为一道题较劲、第一次在作文里写下心里话。那些日子不张扬，却足够明亮，值得被好好记住。',
    gradient: 'from-sky-400/20 to-blue-300/10',
    accent: '#38bdf8',
  },
  {
    id: 'high',
    label: '高中',
    shortLabel: '高中',
    progress: 40,
    emoji: '✏️',
    quote: '常山一中的灯火里，讲台的方向愈来愈清晰。',
    description: '三年答卷换来的不只是分数，更是走向师范之路的每一步踏实。',
    heroTitle: '常山一中，把热爱写进每一页',
    heroDescription:
      '熟悉的走廊、堆满卷的课桌、深夜还亮着的那盏灯。你在常山一中把「想当老师」这件事，一点点写得认真又具体。',
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
    heroTitle: '温大校园，思想与青春交汇',
    heroDescription:
      '问津问道、见习试讲、社团与志愿。梧桐叶落满阶前，你在这里慢慢长成一名准教师该有的模样。',
    gradient: 'from-rose-400/20 to-pink-300/10',
    accent: '#fb7185',
  },
  {
    id: 'graduate',
    label: '研究生',
    shortLabel: '研究生',
    progress: 80,
    emoji: '📖',
    quote: '湖师大校园里，学问与人格一同生长。',
    description: '师大的书声与林荫相伴，读得更深，也离讲台更近了一步。',
    heroTitle: '湖南师大，学问里长出师者模样',
    heroDescription:
      '岳麓山下的风、文献里的追问、研讨室的辩论。你在湖师大把思想政治教育的根扎得更深，也把传道授业的力，炼得更稳。',
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
    heroTitle: '愿你所信所教，都温柔有光',
    heroDescription:
      '未来的讲台在等你。把此刻的真诚与笃定收好，某天面对一双双清澈的眼睛时，你会想起这本拾光录里的自己。',
    gradient: 'from-fuchsia-400/20 to-indigo-300/10',
    accent: '#e879f9',
  },
]

export function getStageById(id: StageId): StageInfo {
  return STAGES.find((s) => s.id === id) ?? STAGES[0]
}

export function getStageHeroCopy(stageId: StageId) {
  const stage = getStageById(stageId)
  return {
    label: `拾 · ${stage.label} · 光`,
    title: stage.heroTitle,
    description: stage.heroDescription,
  }
}
