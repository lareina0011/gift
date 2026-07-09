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
    <div className="page-shell flex-1 overflow-y-auto py-8 pb-16">
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageId}
            initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <FadeIn>
              <SpotlightCard
                className="mb-6 rounded-xl border border-white/[0.06] bg-[#141414] p-6"
                spotlightColor="rgba(255,255,255,0.05)"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <AppIcon config={icon} size={24} className="text-white/70" />
                  </div>
                  <div>
                    <BlurText
                      text={stage.label}
                      className="font-serif text-2xl font-bold text-white"
                      animateBy="letters"
                      delay={40}
                    />
                    <p className="mt-2">
                      <ShinyText
                        text={stage.quote}
                        className="text-sm italic"
                        color="rgba(255,255,255,0.4)"
                        shineColor="rgba(255,255,255,0.85)"
                      />
                    </p>
                    <p className="mt-2 text-sm text-white/45">{stage.description}</p>
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
                    <h3 className="flex items-center gap-2 text-xs tracking-wider text-white/40">
                      <BookOpen className="h-3.5 w-3.5" />
                      回忆记录 ({memories.length})
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      添加回忆
                    </motion.button>
                  </div>
                </FadeIn>

                {memories.length === 0 ? (
                  <FadeIn delay={0.15}>
                    <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
                      <AppIcon
                        config={APP_ICONS.emptyMemory}
                        size={36}
                        className="mx-auto text-white/20"
                      />
                      <p className="mt-3 font-medium text-white/50">还没有回忆记录</p>
                      <p className="mt-1 text-sm text-white/30">
                        点击「添加回忆」，上传照片、视频，写下{stage.label}的故事
                      </p>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 text-xs tracking-wider text-white/50 transition hover:text-white/80"
                      >
                        开始记录 →
                      </button>
                    </div>
                  </FadeIn>
                ) : (
                  <div className="space-y-3">
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
