import { motion } from 'framer-motion'
import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getStageIcon } from '../constants/icons'
import type { FutureWish } from '../types'
import { AppIcon } from './AppIcon'
import { FadeIn, GradientText, SpotlightCard } from './reactbits'

const WISH_EMOJIS = ['🌟', '🎯', '✈️', '💼', '🏠', '❤️', '🌈', '🎨', '📖', '🌸']

interface FutureSectionProps {
  wishes: FutureWish[]
  onAddWish: (text: string, emoji: string) => void
  onDeleteWish: (id: string) => void
}

export function FutureSection({ wishes, onAddWish, onDeleteWish }: FutureSectionProps) {
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState('🌟')
  const [showForm, setShowForm] = useState(false)
  const futureIcon = getStageIcon('future')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAddWish(text.trim(), emoji)
    setText('')
    setShowForm(false)
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
            许下一个愿望，记录一份期待，让未来的某一天回头看见今天的自己。
          </p>
        </SpotlightCard>
      </FadeIn>

      {!showForm ? (
        <FadeIn delay={0.1}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-xs tracking-wider text-white/40 transition hover:border-white/20 hover:text-white/60"
          >
            <Plus className="h-4 w-4" />
            添加一个未来愿望
          </motion.button>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/[0.06] bg-[#141414] p-5"
          >
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-sm border border-white/10 py-2.5 text-xs tracking-wider text-white/40 transition hover:bg-white/5"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-white py-2.5 text-xs font-semibold tracking-wider text-black disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                许下愿望
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
                <button
                  onClick={() => onDeleteWish(wish.id)}
                  className="absolute right-3 top-3 z-20 rounded-sm p-1 text-white/15 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
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
