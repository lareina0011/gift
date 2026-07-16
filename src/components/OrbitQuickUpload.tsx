import { motion } from 'framer-motion'
import { ImagePlus, Loader2, PenLine } from 'lucide-react'
import { useRef, useState } from 'react'

interface OrbitQuickUploadProps {
  compact?: boolean
  uploading?: boolean
  onUpload: (data: { files: File[]; caption: string }) => Promise<void>
}

export function OrbitQuickUpload({
  compact = false,
  uploading = false,
  onUpload,
}: OrbitQuickUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [showCaption, setShowCaption] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length || uploading) return

    const files = [...fileList].filter((file) => file.type.startsWith('image/'))
    if (files.length === 0) {
      setError('请选择图片文件')
      return
    }

    setError('')
    try {
      await onUpload({ files, caption: caption.trim() })
      setCaption('')
      setShowCaption(false)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    }
  }

  const pickFiles = () => {
    if (!uploading) inputRef.current?.click()
  }

  if (compact) {
    return (
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={pickFiles}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs tracking-wider text-white/70 transition hover:border-fuchsia-400/35 hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          {uploading ? '上传中…' : '上传照片到星轨'}
        </button>
        <button
          type="button"
          onClick={() => setShowCaption((v) => !v)}
          className={`inline-flex items-center gap-1.5 text-xs tracking-wider transition ${
            showCaption ? 'text-fuchsia-300/90' : 'text-white/35 hover:text-white/55'
          }`}
        >
          <PenLine className="h-3.5 w-3.5" />
          {showCaption ? '收起文案' : '添加文案（可选）'}
        </button>
        {showCaption && (
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="写几句想说的话，关键词会浮在星轨上"
            className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 placeholder:text-white/25 focus:border-fuchsia-400/35 focus:outline-none sm:w-72"
          />
        )}
        {error && <p className="text-xs text-rose-300/90">{error}</p>}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        void handleFiles(e.dataTransfer.files)
      }}
      className={`mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center transition ${
        dragging
          ? 'border-fuchsia-400/45 bg-fuchsia-500/[0.06]'
          : 'border-white/12 bg-white/[0.02]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <ImagePlus className="h-7 w-7 text-white/25" />
      </div>

      <p className="text-sm text-white/55">拖入照片，或点击开始拾光</p>
      <p className="mt-1 text-xs text-white/28">可以不写文案；写了会自动提取关键词展示在星轨上</p>

      <button
        type="button"
        onClick={pickFiles}
        disabled={uploading}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600/90 to-violet-600/90 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        {uploading ? '上传中…' : '选择照片'}
      </button>

      <button
        type="button"
        onClick={() => setShowCaption((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-wider text-white/35 transition hover:text-white/55"
      >
        <PenLine className="h-3.5 w-3.5" />
        {showCaption ? '收起文案' : '添加文案（可选）'}
      </button>

      {showCaption && (
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          placeholder="例如：毕业典礼那天，阳光很好，我们笑得很开心"
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/80 placeholder:text-white/25 focus:border-fuchsia-400/35 focus:outline-none"
        />
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300/90">
          {error}
        </p>
      )}
    </motion.div>
  )
}
