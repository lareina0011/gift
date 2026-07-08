import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { useMediaUrl } from '../hooks/useMediaUrl'
import type { MediaItem } from '../types'

interface MediaViewerProps {
  media: MediaItem[]
  initialIndex?: number
  onClose: () => void
}

function MediaSlide({ item }: { item: MediaItem }) {
  const url = useMediaUrl(item.blobKey)

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center text-white/60">
        加载中...
      </div>
    )
  }

  if (item.type === 'video') {
    return (
      <video
        src={url}
        controls
        className="max-h-[80vh] max-w-full rounded-lg"
      />
    )
  }

  return (
    <img
      src={url}
      alt={item.name}
      className="max-h-[80vh] max-w-full rounded-lg object-contain"
    />
  )
}

export function MediaViewer({ media, initialIndex = 0, onClose }: MediaViewerProps) {
  const [index, setIndex] = useState(initialIndex)

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : media.length - 1))
  const next = () => setIndex((i) => (i < media.length - 1 ? i + 1 : 0))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-4 top-16 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-16 sm:top-1/2 sm:-translate-y-1/2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div onClick={(e) => e.stopPropagation()}>
          <MediaSlide item={media[index]} />
          {media.length > 1 && (
            <p className="mt-3 text-center text-sm text-white/60">
              {index + 1} / {media.length}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

interface MediaThumbnailProps {
  item: MediaItem
  onClick: () => void
}

export function MediaThumbnail({ item, onClick }: MediaThumbnailProps) {
  const url = useMediaUrl(item.blobKey)

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
    >
      {url ? (
        item.type === 'video' ? (
          <video src={url} className="h-full w-full object-cover" muted />
        ) : (
          <img src={url} alt={item.name} className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-stone-400">
          ...
        </div>
      )}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-full bg-white/80 px-2 py-1 text-xs">▶</div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
    </button>
  )
}
