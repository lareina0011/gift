import { motion } from 'framer-motion'
import { Calendar, Image, Trash2, Video } from 'lucide-react'
import { useState } from 'react'
import type { Memory } from '../types'
import { MediaThumbnail, MediaViewer } from './MediaViewer'
import { SpotlightCard } from './reactbits'

interface MemoryCardProps {
  memory: Memory
  onDelete: (id: string) => void
}

export function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <>
      <SpotlightCard
        className="group rounded-xl border border-white/[0.06] bg-[#141414] transition hover:border-white/10"
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
              </p>
            </div>
            <button
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
        </motion.article>
      </SpotlightCard>

      {viewerIndex !== null && (
        <MediaViewer
          media={memory.media}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}
