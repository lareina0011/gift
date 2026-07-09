import { ImageIcon } from 'lucide-react'
import type { Memory } from '../types'
import { useMemoryImageUrls } from '../hooks/useMemoryImageUrls'
import { FadeIn, OrbitImages } from './reactbits'

interface MemoryOrbitGalleryProps {
  memories: Memory[]
}

export function MemoryOrbitGallery({ memories }: MemoryOrbitGalleryProps) {
  const { images, ready, totalImageCount } = useMemoryImageUrls(memories)

  return (
    <section className="border-t border-white/[0.06] py-10 sm:py-14">
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
                ? `已收录 ${totalImageCount} 张照片，在轨道上缓缓流转`
                : '上传照片后，它们会在这里组成一条时光轨道'}
            </p>
          </div>
        </FadeIn>

        {!ready ? (
          <div className="flex h-48 items-center justify-center text-sm text-white/30">
            加载照片中...
          </div>
        ) : totalImageCount === 0 ? (
          <FadeIn delay={0.1}>
            <div className="mx-auto flex max-w-sm flex-col items-center rounded-xl border border-dashed border-white/10 py-14 text-center">
              <ImageIcon className="h-8 w-8 text-white/20" />
              <p className="mt-3 text-sm text-white/45">还没有照片可以展示</p>
              <p className="mt-1 text-xs text-white/25">在上方添加回忆并上传图片</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1}>
            <OrbitImages
              images={images.map((item) => item.url)}
              altPrefix="回忆照片"
              shape="ellipse"
              responsive
              showPath
              pathColor="rgba(168, 85, 247, 0.18)"
              pathWidth={1.5}
              itemSize={76}
              duration={48}
              rotation={-6}
              radiusX={620}
              radiusY={200}
              itemClassName="h-full w-full rounded-xl border border-white/15 object-cover shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
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
    </section>
  )
}
