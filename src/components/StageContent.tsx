import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { APP_ICONS, getStageIcon } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { getStageById } from '../constants/stages'
import type { FutureWish, Memory, StageId } from '../types'
import { AddMemoryModal } from './AddMemoryModal'
import { FutureSection } from './FutureSection'
import { MemoryCard } from './MemoryCard'
import { BlurText, FadeIn, ShinyText, SpotlightCard } from './reactbits'

interface StageContentProps {
  stageId: StageId
  memories: Memory[]
  wishes: FutureWish[]
  onAddMemory: (data: {
    title: string
    content: string
    date: string
    files: File[]
  }) => Promise<void>
  onDeleteMemory: (id: string) => void
  onAddWish: (text: string, emoji: string) => void
  onDeleteWish: (id: string) => void
}

export function StageContent({
  stageId,
  memories,
  wishes,
  onAddMemory,
  onDeleteMemory,
  onAddWish,
  onDeleteWish,
}: StageContentProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const stage = getStageById(stageId)
  const icon = getStageIcon(stageId)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <FadeIn>
              <SpotlightCard
                className={`mb-6 rounded-2xl border border-white/50 bg-gradient-to-br ${stage.gradient} p-6`}
                spotlightColor="rgba(167, 139, 250, 0.2)"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                    <AppIcon config={icon} size={28} className="text-violet-500" />
                  </div>
                  <div>
                    <BlurText
                      text={stage.label}
                      className="font-serif text-2xl font-bold text-stone-800"
                      animateBy="letters"
                      delay={40}
                    />
                    <p className="mt-2">
                      <ShinyText
                        text={stage.quote}
                        className="text-sm italic"
                        color="#78716c"
                        shineColor="#a855f7"
                      />
                    </p>
                    <p className="mt-2 text-sm text-stone-600">{stage.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>

            {stageId === 'future' ? (
              <FutureSection
                wishes={wishes}
                onAddWish={onAddWish}
                onDeleteWish={onDeleteWish}
              />
            ) : (
              <>
                <FadeIn delay={0.1}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-stone-500">
                      <BookOpen className="h-4 w-4" />
                      回忆记录 ({memories.length})
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(167,139,250,0.25)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-rose-400 px-4 py-2 text-sm font-medium text-white shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      添加回忆
                    </motion.button>
                  </div>
                </FadeIn>

                {memories.length === 0 ? (
                  <FadeIn delay={0.15}>
                    <div className="rounded-2xl border-2 border-dashed border-violet-200/80 py-16 text-center">
                      <AppIcon
                        config={APP_ICONS.emptyMemory}
                        size={40}
                        className="mx-auto text-violet-300"
                      />
                      <p className="mt-3 font-medium text-stone-500">还没有回忆记录</p>
                      <p className="mt-1 text-sm text-stone-400">
                        点击「添加回忆」，上传照片、视频，写下{stage.label}的故事
                      </p>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 text-sm font-medium text-violet-500 hover:text-violet-600"
                      >
                        开始记录 →
                      </button>
                    </div>
                  </FadeIn>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {memories.map((memory, i) => (
                        <FadeIn key={memory.id} delay={i * 0.05}>
                          <MemoryCard memory={memory} onDelete={onDeleteMemory} />
                        </FadeIn>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AddMemoryModal
        open={modalOpen}
        stageLabel={stage.label}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          await onAddMemory(data)
        }}
      />
    </div>
  )
}
