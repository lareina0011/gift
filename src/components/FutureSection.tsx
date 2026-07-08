import { motion } from 'framer-motion'
import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getStageIcon } from '../constants/icons'
import { AppIcon } from './AppIcon'
import type { FutureWish } from '../types'
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
    <div className="space-y-6">
      <FadeIn>
        <SpotlightCard
          className="rounded-2xl border border-fuchsia-200/60 bg-gradient-to-br from-fuchsia-50/80 to-indigo-50/80 p-6 text-center"
          spotlightColor="rgba(232, 121, 249, 0.2)"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-3 flex justify-center"
          >
            <AppIcon config={futureIcon} size={36} className="text-fuchsia-500" />
          </motion.div>
          <GradientText className="font-serif text-xl font-bold">
            写给未来的自己
          </GradientText>
          <p className="mt-2 text-sm text-stone-500">
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-fuchsia-200 py-4 text-fuchsia-500 transition hover:border-fuchsia-300 hover:bg-fuchsia-50/50"
          >
            <Plus className="h-5 w-5" />
            添加一个未来愿望
          </motion.button>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {WISH_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-lg px-2 py-1 text-lg transition ${
                    emoji === e ? 'bg-fuchsia-100 ring-2 ring-fuchsia-300' : 'hover:bg-stone-50'
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
              className="mb-3 w-full resize-none rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-100"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-stone-500 transition hover:bg-stone-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-400 to-indigo-400 py-2.5 font-medium text-white disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
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
                className="group relative rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm"
                spotlightColor="rgba(167, 139, 250, 0.15)"
              >
                <button
                  onClick={() => onDeleteWish(wish.id)}
                  className="absolute right-3 top-3 z-20 rounded-lg p-1 text-stone-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="text-2xl">{wish.emoji}</span>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{wish.text}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}
