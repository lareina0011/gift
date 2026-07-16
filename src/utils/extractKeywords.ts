const STOP_WORDS = new Set([
  '的',
  '了',
  '在',
  '是',
  '和',
  '与',
  '也',
  '都',
  '就',
  '还',
  '很',
  '我们',
  '你们',
  '他们',
  '一个',
  '这个',
  '那个',
  '没有',
  '不是',
  '可以',
  '因为',
  '所以',
  '但是',
  '如果',
  '已经',
  '一起',
  '时候',
  '今天',
  '那天',
  '自己',
  '什么',
  '怎么',
  '这样',
  '那样',
  '这里',
  '那里',
  '还是',
  '或者',
  '然后',
  '虽然',
  '不过',
  '其实',
  '真的',
  '觉得',
  '知道',
  '看到',
  '照片',
  '回忆',
  '星轨',
  '拾光',
])

function tokenize(text: string): string[] {
  const cleaned = text
    .replace(/[，。！？、；：""''（）\s,.!?;:'"()\-—…·]/g, ' ')
    .trim()

  if (!cleaned) return []

  const spaced = cleaned.split(/\s+/).filter((part) => part.length >= 2)
  const chinese = cleaned.match(/[\u4e00-\u9fff]{2,6}/g) ?? []
  const english = cleaned.match(/[a-zA-Z]{3,}/g)?.map((w) => w.toLowerCase()) ?? []

  return [...spaced, ...chinese, ...english]
}

/** 从标题与正文中提取 1–2 个简短关键词，用于星轨展示 */
export function extractKeywords(
  title: string,
  content: string,
  max = 2,
): string[] {
  const source = `${title} ${content}`.trim()
  if (!source) return []

  const seen = new Set<string>()
  const result: string[] = []

  for (const token of tokenize(source)) {
    const word = token.trim()
    if (word.length < 2 || word.length > 8) continue
    if (STOP_WORDS.has(word)) continue
    if (/^星轨拾光/.test(word)) continue
    if (seen.has(word)) continue

    seen.add(word)
    result.push(word)
    if (result.length >= max) break
  }

  return result
}
