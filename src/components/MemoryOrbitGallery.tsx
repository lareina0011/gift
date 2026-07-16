import { ImageIcon } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { MediaItem, Memory } from '../types'
import { useMemoryImageUrls } from '../hooks/useMemoryImageUrls'
import { extractKeywords } from '../utils/extractKeywords'
import { MediaViewer } from './MediaViewer'
import { OrbitQuickUpload } from './OrbitQuickUpload'
import { FadeIn, OrbitImages } from './reactbits'

interface MemoryOrbitGalleryProps {
  memories: Memory[]
  canUpload: boolean
  onAddMemory: (data: {
    title: string
    content: string
    date: string
    files: File[]
  }) => Promise<void>
}

function OrbitPhotoItem({ url, alt }: { url: string; alt: string }) {
  return (
    <img
      src={url}
      alt={alt}
      draggable={false}
      className="h-full w-full rounded-xl border border-white/15 object-cover shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
    />
  )
}

function OrbitKeywordNode({ word }: { word: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="rounded-full border border-white/12 bg-[#120818]/55 px-3 py-1 font-serif text-[11px] italic tracking-wide text-white/70 backdrop-blur-sm">
        {word}
      </span>
    </div>
  )
}

export function MemoryOrbitGallery({
  memories,
  canUpload,
  onAddMemory,
}: MemoryOrbitGalleryProps) {
  const { images, ready, totalImageCount } = useMemoryImageUrls(memories)
  const [viewer, setViewer] = useState<{ media: MediaItem[]; index: number } | null>(null)
  const [uploading, setUploading] = useState(false)

  const unlockedMemories = useMemo(
    () => memories.filter((m) => !m.locked),
    [memories],
  )

  const orbitNodes = useMemo(() => {
    const nodes: Array<{
      kind: 'photo' | 'keyword'
      photoIndex?: number
      node: ReactNode
    }> = []

    images.forEach((entry, index) => {
      const keywords = extractKeywords(entry.title, entry.content)

      nodes.push({
        kind: 'photo',
        photoIndex: index,
        node: (
          <OrbitPhotoItem
            key={`photo-${entry.mediaId}`}
            url={entry.url}
            alt={entry.title || '回忆照片'}
          />
        ),
      })

      keywords.forEach((word) => {
        nodes.push({
          kind: 'keyword',
          node: <OrbitKeywordNode key={`kw-${entry.mediaId}-${word}`} word={word} />,
        })
      })
    })

    return nodes
  }, [images])

  const handleClick = (nodeIndex: number) => {
    const node = orbitNodes[nodeIndex]
    if (!node || node.kind !== 'photo' || node.photoIndex === undefined) return

    const entry = images[node.photoIndex]
    if (!entry) return

    const memory = unlockedMemories.find((m) => m.id === entry.memoryId)
    if (!memory) return

    const mediaIndex = memory.media.findIndex((m) => m.id === entry.mediaId)
    setViewer({
      media: memory.media,
      index: mediaIndex >= 0 ? mediaIndex : 0,
    })
  }

  const handleUpload = useCallback(
    async ({ files, caption }: { files: File[]; caption: string }) => {
      setUploading(true)
      try {
        const today = new Date().toISOString().slice(0, 10)
        const title = caption
          ? caption.slice(0, 24)
          : `星轨拾光 · ${today.replace(/-/g, '.')}`

        await onAddMemory({
          title,
          content: caption,
          date: today,
          files,
        })
      } finally {
        setUploading(false)
      }
    },
    [onAddMemory],
  )

  return (
    <section className="border-t border-white/[0.08] py-10 sm:py-14">
      <div className="page-shell">
        <FadeIn>
          <div className="mb-6 text-center sm:mb-8">
            <p className="text-[11px] font-medium tracking-[0.3em] text-white/35">
              MEMORY CONSTELLATION
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
              拾光星轨
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
              {totalImageCount > 0
                ? `已收录 ${totalImageCount} 张照片，点击轨道上的照片可放大查看`
                : '上传照片后，它们会在这里组成一条时光轨道'}
            </p>
          </div>
        </FadeIn>

        {canUpload && totalImageCount > 0 && (
          <OrbitQuickUpload compact uploading={uploading} onUpload={handleUpload} />
        )}

        <div className="orbit-stage">
          <div className="orbit-stage__inner">
            {!ready ? (
              <div className="flex h-48 items-center justify-center text-sm text-white/30">
                加载照片中...
              </div>
            ) : totalImageCount === 0 ? (
              <FadeIn delay={0.1}>
                {canUpload ? (
                  <OrbitQuickUpload uploading={uploading} onUpload={handleUpload} />
                ) : (
                  <div className="mx-auto flex max-w-sm flex-col items-center rounded-xl border border-dashed border-white/14 py-14 text-center">
                    <ImageIcon className="h-8 w-8 text-white/20" />
                    <p className="mt-3 text-sm text-white/45">还没有照片可以展示</p>
                    <p className="mt-1 text-xs text-white/25">等待拾光的人把照片放上来</p>
                  </div>
                )}
              </FadeIn>
            ) : (
              <FadeIn delay={0.1}>
                <OrbitImages
                  items={orbitNodes.map((entry) => entry.node)}
                  shape="ellipse"
                  responsive
                  showPath
                  pathColor="rgba(192, 132, 252, 0.38)"
                  pathWidth={1.75}
                  itemSize={84}
                  duration={48}
                  rotation={-6}
                  radiusX={620}
                  radiusY={200}
                  onItemClick={handleClick}
                  centerContent={
                    <div className="pointer-events-none text-center">
                      <p className="font-serif text-3xl font-bold text-white/90 sm:text-4xl">
                        {totalImageCount}
                      </p>
                      <p className="mt-1 text-[11px] tracking-[0.25em] text-white/40">张照片</p>
                    </div>
                  }
                />
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {viewer && (
        <MediaViewer
          media={viewer.media}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  )
}
