import { motion } from 'framer-motion'
import { Calendar, Image, Lock, Pencil, Trash2, Video } from 'lucide-react'
import { useState } from 'react'
import type { Memory } from '../types'
import { MediaThumbnail, MediaViewer } from './MediaViewer'
import { SpotlightCard } from './reactbits'

interface MemoryCardProps {
  memory: Memory
  canEdit: boolean
  onEdit: (memory: Memory) => void
  onDelete: (id: string) => void
}

export function MemoryCard({ memory, canEdit, onEdit, onDelete }: MemoryCardProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const locked = !!memory.locked && !canEdit
  const previewLocked = !!memory.locked && canEdit

  return (
    <>
      <SpotlightCard
        className="group relative rounded-xl border glass-panel transition hover:border-white/15"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <motion.article layout className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-white/90">
                {memory.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-white/30">
                <Calendar className="h-3 w-3" />
                {memory.date}
                {memory.unlockAt && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-200/50">
                    <Lock className="h-3 w-3" />
                    {memory.unlockAt} 解锁
                  </span>
                )}
              </p>
            </div>
            {canEdit && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(memory)}
                  className="rounded-sm p-1.5 text-white/15 opacity-0 transition hover:bg-white/5 hover:text-white/50 group-hover:opacity-100"
                  title="编辑"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmDelete) {
                      onDelete(memory.id)
                    } else {
                      setConfirmDelete(true)
                      setTimeout(() => setConfirmDelete(false), 3000)
                    }
                  }}
                  className={`rounded-sm p-1.5 transition ${
                    confirmDelete
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-white/15 opacity-0 hover:bg-white/5 hover:text-white/50 group-hover:opacity-100'
                  }`}
                  title={confirmDelete ? '再次点击确认删除' : '删除'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {locked ? (
            <div className="relative overflow-hidden rounded-lg border border-amber-200/10 bg-amber-100/[0.03] px-4 py-10 text-center">
              <Lock className="mx-auto h-6 w-6 text-amber-100/40" />
              <p className="mt-3 text-sm text-white/45">时间胶囊尚未开启</p>
              <p className="mt-1 text-xs text-white/30">
                将于 {memory.unlockAt} 揭晓这份回忆
              </p>
            </div>
          ) : (
            <>
              {previewLocked && (
                <p className="mb-3 rounded-lg border border-amber-200/15 bg-amber-100/[0.04] px-3 py-2 text-xs text-amber-100/55">
                  预览中：对方将在 {memory.unlockAt} 才能看到正文与媒体
                </p>
              )}
              {memory.content && (
                <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-white/50">
                  {memory.content}
                </p>
              )}

              {memory.media.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {memory.media.map((item, i) => (
                    <MediaThumbnail
                      key={item.id}
                      item={item}
                      onClick={() => setViewerIndex(i)}
                    />
                  ))}
                </div>
              )}

              {memory.media.length > 0 && (
                <div className="mt-3 flex gap-3 text-xs text-white/25">
                  {memory.media.some((m) => m.type === 'image') && (
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {memory.media.filter((m) => m.type === 'image').length} 张图片
                    </span>
                  )}
                  {memory.media.some((m) => m.type === 'video') && (
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      {memory.media.filter((m) => m.type === 'video').length} 个视频
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </motion.article>
      </SpotlightCard>

      {viewerIndex !== null && !locked && (
        <MediaViewer
          media={memory.media}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}
