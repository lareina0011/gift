import { motion } from 'framer-motion'
import { Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { getStageIcon } from '../constants/icons'
import type { FutureWish } from '../types'
import { AppIcon } from './AppIcon'
import { FadeIn, GradientText, SpotlightCard } from './reactbits'

const WISH_EMOJIS = ['🌟', '🎯', '✈️', '💼', '🏠', '❤️', '🌈', '🎨', '📖', '🌸']

const TEACHER_TEMPLATES = [
  '站稳讲台，把温暖与信念留给每一堂课',
  '做学生记得住、记得起的老师',
  '在思政课堂上，看见真实的思想与生命',
  '愿我教过的孩子，都能勇敢而善良地长大',
  '写给讲台上的自己：温柔而坚定',
  '把所学化作能讲、能传的力量',
]

interface FutureSectionProps {
  wishes: FutureWish[]
  onAddWish: (text: string, emoji: string) => Promise<unknown> | void
  onEditWish: (id: string, text: string, emoji: string) => Promise<unknown> | void
  onDeleteWish: (id: string) => void
}

export function FutureSection({
  wishes,
  onAddWish,
  onEditWish,
  onDeleteWish,
}: FutureSectionProps) {
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState('🌟')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageOk, setMessageOk] = useState(true)
  const futureIcon = getStageIcon('future')

  const startEdit = (wish: FutureWish) => {
    setEditingId(wish.id)
    setText(wish.text)
    setEmoji(wish.emoji)
    setShowForm(true)
    setMessage('')
  }

  const resetForm = (keepOpen = false) => {
    setText('')
    setEmoji('🌟')
    setEditingId(null)
    setShowForm(keepOpen)
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || saving) return
    setSaving(true)
    setMessage('')
    try {
      if (editingId) {
        await onEditWish(editingId, text.trim(), emoji)
        resetForm(true)
        setMessageOk(true)
        setMessage('已更新愿望')
      } else {
        await onAddWish(text.trim(), emoji)
        setText('')
        setEditingId(null)
        setShowForm(true)
        setMessageOk(true)
        setMessage('已添加，可以继续写下一条')
      }
    } catch (err) {
      setMessageOk(false)
      setMessage(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FadeIn>
        <SpotlightCard
          className="rounded-xl border border-white/[0.06] bg-[#141414] p-6 text-center"
          spotlightColor="rgba(255,255,255,0.05)"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-3 flex justify-center"
          >
            <AppIcon config={futureIcon} size={32} className="text-white/60" />
          </motion.div>
          <GradientText className="font-serif text-xl font-bold">
            写给未来的自己
          </GradientText>
          <p className="mt-2 text-sm text-white/40">
            可以许下很多个愿望，也可以随时改写。让未来的某一天回头看见今天的自己。
          </p>
        </SpotlightCard>
      </FadeIn>

      {!showForm ? (
        <FadeIn delay={0.1}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              resetForm(true)
              setShowForm(true)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-xs tracking-wider text-white/40 transition hover:border-white/20 hover:text-white/60"
          >
            <Plus className="h-4 w-4" />
            {wishes.length > 0 ? '再许一个愿望' : '添加一个未来愿望'}
          </motion.button>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/[0.06] bg-[#141414] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs tracking-wider text-white/40">
                {editingId ? '编辑愿望' : '新建愿望'}
              </p>
              <button
                type="button"
                onClick={() => resetForm(false)}
                className="rounded-sm p-1 text-white/30 transition hover:text-white/60"
                aria-label="关闭表单"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3">
              <p className="mb-2 text-[11px] tracking-wider text-white/30">写给讲台的自己 · 模板</p>
              <div className="flex flex-wrap gap-2">
                {TEACHER_TEMPLATES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setText(t)}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45 transition hover:border-white/25 hover:text-white/75"
                  >
                    {t.length > 14 ? `${t.slice(0, 14)}…` : t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {WISH_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-sm px-2 py-1 text-lg transition ${
                    emoji === e ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="我希望未来能够..."
              rows={3}
              className="mb-3 w-full resize-none rounded-sm border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white placeholder:text-white/20 outline-none focus:border-white/25"
              autoFocus
            />
            {message && (
              <p className={`mb-3 text-xs ${messageOk ? 'text-emerald-400/90' : 'text-rose-400/90'}`}>
                {message}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => resetForm(false)}
                className="flex-1 rounded-sm border border-white/10 py-2.5 text-xs tracking-wider text-white/40 transition hover:bg-white/5"
              >
                收起
              </button>
              <button
                type="submit"
                disabled={!text.trim() || saving}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-white py-2.5 text-xs font-semibold tracking-wider text-black disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {saving ? '保存中…' : editingId ? '保存修改' : '许下愿望'}
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {wishes.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {wishes.map((wish, i) => (
            <FadeIn key={wish.id} delay={i * 0.05}>
              <SpotlightCard
                className="group relative rounded-xl border border-white/[0.06] bg-[#141414] p-4"
                spotlightColor="rgba(255,255,255,0.04)"
              >
                <div className="absolute right-3 top-3 z-20 flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(wish)}
                    className="rounded-sm p-1 text-white/35 transition hover:bg-white/5 hover:text-white/80"
                    title="编辑"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWish(wish.id)}
                    className="rounded-sm p-1 text-white/35 transition hover:bg-red-500/10 hover:text-red-400"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-2xl">{wish.emoji}</span>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{wish.text}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}
