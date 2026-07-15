import { motion } from 'framer-motion'
import { getStageIcon } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'

interface StageTabsProps {
  activeStage: StageId
  onChange: (id: StageId) => void
  memoryCounts: Record<StageId, number>
  iconUrls?: Partial<Record<StageId, string>>
}

export function StageTabs({ activeStage, onChange, memoryCounts, iconUrls }: StageTabsProps) {
  return (
    <nav className="flex w-full gap-1">
      {STAGES.map((stage) => {
        const active = activeStage === stage.id
        const count = memoryCounts[stage.id] ?? 0
        const base = getStageIcon(stage.id)
        const icon = { ...base, customSrc: iconUrls?.[stage.id] ?? base.customSrc }

        return (
          <button
            key={stage.id}
            onClick={() => onChange(stage.id)}
            className="group relative min-w-0 flex-1"
          >
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center gap-0.5 rounded-sm px-1 py-2 transition sm:flex-row sm:justify-center sm:gap-1.5 sm:px-2 sm:py-2.5 ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              }`}
            >
              <AppIcon
                config={icon}
                size={active ? 20 : 16}
                className={active ? 'text-white' : 'text-white/35'}
              />
              <span className="truncate text-[11px] font-medium tracking-wide sm:text-xs">
                {stage.shortLabel}
              </span>
              {count > 0 && (
                <span
                  className={`rounded-full px-1 py-0.5 text-[9px] font-semibold ${
                    active ? 'bg-white/15 text-white/80' : 'bg-white/5 text-white/30'
                  }`}
                >
                  {count}
                </span>
              )}
            </motion.div>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -bottom-1 left-1/2 h-px w-8 -translate-x-1/2 bg-white/60"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
