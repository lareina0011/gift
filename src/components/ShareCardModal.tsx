import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { STAGES } from '../constants/stages'

interface ShareCardModalProps {
  open: boolean
  onClose: () => void
}

export function ShareCardModal({ open, onClose }: ShareCardModalProps) {
  const quotes = useMemo(
    () => [
      APP_CONFIG.hero.title,
      ...STAGES.map((s) => s.quote),
      '愿你所信所教，都温柔有光。',
    ],
    [],
  )
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [busy, setBusy] = useState(false)

  const download = async () => {
    setBusy(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1620
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grad.addColorStop(0, '#1a1028')
      grad.addColorStop(0.45, '#2a1540')
      grad.addColorStop(1, '#0c0a12')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fillRect(72, 72, canvas.width - 144, canvas.height - 144)

      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.font = '28px sans-serif'
      ctx.letterSpacing = '8px'
      ctx.fillText('拾 · 光 · 录', 120, 220)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 64px serif'
      wrapText(ctx, APP_CONFIG.siteTitle, 120, 320, canvas.width - 240, 78)

      ctx.fillStyle = 'rgba(255,255,255,0.72)'
      ctx.font = 'italic 40px serif'
      wrapText(ctx, quotes[quoteIndex] ?? '', 120, 520, canvas.width - 240, 58)

      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '26px sans-serif'
      ctx.fillText('愿细碎的时光，都被温柔留下', 120, canvas.height - 180)

      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `拾光录-纪念卡.png`
      a.click()
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141418] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-white">生成纪念卡</h3>
              <button type="button" onClick={onClose} className="p-2 text-white/35 hover:text-white/70">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-white/40">选择一句寄语，下载竖版 PNG，可发朋友圈。</p>
            <div className="mb-5 max-h-48 space-y-2 overflow-y-auto">
              {quotes.map((q, i) => (
                <button
                  key={`${q}-${i}`}
                  type="button"
                  onClick={() => setQuoteIndex(i)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    quoteIndex === i
                      ? 'border-white/25 bg-white/10 text-white'
                      : 'border-white/[0.06] text-white/50 hover:border-white/15'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={download}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {busy ? '生成中…' : '下载纪念卡'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = [...text]
  let line = ''
  let cy = y
  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = ch
      cy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cy)
}
