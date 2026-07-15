import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
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
  isEditor: boolean
  stageIconUrl?: string | null
  onAddMemory: (data: {
    title: string
    content: string
    date: string
    files: File[]
    unlockAt?: string | null
  }) => Promise<void>
  onEditMemory: (
    id: string,
    data: {
      title: string
      content: string
      date: string
      files: File[]
      removeMediaIds: string[]
      unlockAt?: string | null
    },
  ) => Promise<void>
  onDeleteMemory: (id: string) => void
  onAddWish: (text: string, emoji: string) => Promise<unknown> | void
  onEditWish: (id: string, text: string, emoji: string) => Promise<unknown> | void
  onDeleteWish: (id: string) => void
}

export function StageContent({
  stageId,
  memories,
  wishes,
  isEditor,
  stageIconUrl,
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onAddWish,
  onEditWish,
  onDeleteWish,
}: StageContentProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const stage = getStageById(stageId)
  const icon = {
    ...getStageIcon(stageId),
    customSrc: stageIconUrl ?? getStageIcon(stageId).customSrc,
  }

  const years = useMemo(() => {
    const set = new Set(memories.map((m) => m.date.slice(0, 4)).filter(Boolean))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [memories])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return memories.filter((m) => {
      if (year !== 'all' && !m.date.startsWith(year)) return false
      if (!q) return true
      return (
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q)
      )
    })
  }, [memories, query, year])

  const openCreate = () => {
    setEditingMemory(null)
    setModalOpen(true)
  }

  const openEdit = (memory: Memory) => {
    setEditingMemory(memory)
    setModalOpen(true)
  }

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
                onEditWish={onEditWish}
                onDeleteWish={onDeleteWish}
              />
            ) : (
              <>
                <FadeIn delay={0.1}>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="flex items-center gap-2 text-xs tracking-wider text-white/40">
                      <BookOpen className="h-3.5 w-3.5" />
                      回忆记录 ({filtered.length}/{memories.length})
                    </h3>
                    {isEditor && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={openCreate}
                        className="flex items-center gap-1.5 self-start rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        添加回忆
                      </motion.button>
                    )}
                  </div>
                </FadeIn>

                {memories.length > 0 && (
                  <FadeIn delay={0.12}>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="搜索标题或内容…"
                          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                        />
                      </div>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white/70 outline-none"
                      >
                        <option value="all">全部年份</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y} 年
                          </option>
                        ))}
                      </select>
                    </div>
                  </FadeIn>
                )}

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
                        {isEditor
                          ? `点击「添加回忆」，上传照片、视频，写下${stage.label}的故事`
                          : '回忆会慢慢被写进这里'}
                      </p>
                      {isEditor && (
                        <button
                          onClick={openCreate}
                          className="mt-4 text-xs tracking-wider text-white/50 transition hover:text-white/80"
                        >
                          开始记录 →
                        </button>
                      )}
                    </div>
                  </FadeIn>
                ) : filtered.length === 0 ? (
                  <p className="py-10 text-center text-sm text-white/30">没有匹配的回忆</p>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filtered.map((memory, i) => (
                        <FadeIn key={memory.id} delay={i * 0.05}>
                          <MemoryCard
                            memory={memory}
                            canEdit={isEditor}
                            onEdit={openEdit}
                            onDelete={onDeleteMemory}
                          />
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

      {isEditor && (
        <AddMemoryModal
          open={modalOpen}
          stageLabel={stage.label}
          initialMemory={editingMemory}
          onClose={() => {
            setModalOpen(false)
            setEditingMemory(null)
          }}
          onSubmit={async (data) => {
            if (editingMemory) {
              await onEditMemory(editingMemory.id, data)
            } else {
              await onAddMemory({
                title: data.title,
                content: data.content,
                date: data.date,
                files: data.files,
                unlockAt: data.unlockAt,
              })
            }
          }}
        />
      )}
    </div>
  )
}
