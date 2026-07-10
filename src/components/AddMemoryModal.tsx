import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ImagePlus, PenLine, Upload, X } from 'lucide-react'
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
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setTitle('')
    setContent('')
    setDate(new Date().toISOString().slice(0, 10))
    previews.forEach((p) => URL.revokeObjectURL(p))
    setFiles([])
    setPreviews([])
    setSubmitting(false)
    setFocusedField(null)
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

  const fieldClass = (name: string) =>
    `login-input-wrap ${focusedField === name ? 'login-input-wrap--focused' : ''}`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 32, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="memory-modal-card w-full max-w-lg overflow-hidden rounded-t-[1.35rem] p-px sm:rounded-[1.35rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[90vh] overflow-y-auto rounded-t-[1.3rem] bg-[#0c0a12]/92 px-6 py-7 backdrop-blur-2xl sm:rounded-[1.3rem] sm:px-8 sm:py-8">
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl"
                aria-hidden
              />

              <div className="relative mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.28em] text-white/35">NEW MEMORY</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-white">
                    记录一段回忆
                  </h2>
                  <p className="mt-1.5 text-sm text-white/40">{stageLabel}阶段</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-white/10 p-2 text-white/35 transition hover:border-white/20 hover:bg-white/5 hover:text-white/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-medium tracking-[0.18em] text-white/35">
                    标题
                  </label>
                  <div className={fieldClass('title')}>
                    <PenLine className="login-input-icon h-4 w-4" />
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="给这段回忆起个名字"
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium tracking-[0.18em] text-white/35">
                    日期
                  </label>
                  <div className={fieldClass('date')}>
                    <Calendar className="login-input-icon h-4 w-4" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onFocus={() => setFocusedField('date')}
                      onBlur={() => setFocusedField(null)}
                      className="login-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium tracking-[0.18em] text-white/35">
                    故事
                  </label>
                  <div className={`${fieldClass('content')} items-start`}>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onFocus={() => setFocusedField('content')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="写下当时的心情与细节..."
                      rows={4}
                      className="login-input min-h-[110px] resize-none py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium tracking-[0.18em] text-white/35">
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
                    className="memory-upload-zone flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/12 bg-white/[0.02] py-8 text-white/35 transition hover:border-fuchsia-400/35 hover:bg-white/[0.04] hover:text-white/55"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">点击上传图片或视频</span>
                  </button>

                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {previews.map((preview, i) => (
                        <div key={preview} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                          {files[i]?.type.startsWith('video/') ? (
                            <video
                              src={preview}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={preview}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
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
                  whileHover={{ scale: !title.trim() || submitting ? 1 : 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="login-submit-btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-semibold tracking-[0.1em] text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ImagePlus className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">
                    {submitting ? '保存中...' : '保存回忆'}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
