import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface AddMemoryModalProps {
  open: boolean
  stageLabel: string
  onClose: () => void
  onSubmit: (data: {
    title: string
    content: string
    date: string
    files: File[]
  }) => Promise<void>
}

export function AddMemoryModal({
  open,
  stageLabel,
  onClose,
  onSubmit,
}: AddMemoryModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setTitle('')
    setContent('')
    setDate(new Date().toISOString().slice(0, 10))
    previews.forEach((p) => URL.revokeObjectURL(p))
    setFiles([])
    setPreviews([])
    setSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return
    const newFiles = Array.from(selected)
    setFiles((prev) => [...prev, ...newFiles])
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ])
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), date, files })
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-800">
                  记录一段回忆
                </h2>
                <p className="text-sm text-stone-400">{stageLabel}阶段</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  标题
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给这段回忆起个名字"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  日期
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  故事
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下当时的心情与细节..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600">
                  图片 / 视频
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 py-6 text-stone-400 transition hover:border-rose-300 hover:text-rose-400"
                >
                  <Upload className="h-5 w-5" />
                  点击上传图片或视频
                </button>

                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {previews.map((preview, i) => (
                      <div key={preview} className="group relative aspect-square">
                        {files[i]?.type.startsWith('video/') ? (
                          <video
                            src={preview}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          <img
                            src={preview}
                            alt=""
                            className="h-full w-full rounded-lg object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute -right-1 -top-1 rounded-full bg-rose-500 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={!title.trim() || submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-violet-400 py-3 font-medium text-white shadow-lg disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" />
                {submitting ? '保存中...' : '保存回忆'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
