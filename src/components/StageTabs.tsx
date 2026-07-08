import { motion } from 'framer-motion'
import { getStageIcon } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'

interface StageTabsProps {
  activeStage: StageId
  onChange: (id: StageId) => void
  memoryCounts: Record<StageId, number>
}

export function StageTabs({ activeStage, onChange, memoryCounts }: StageTabsProps) {
  return (
    <nav className="flex w-full gap-1">
      {STAGES.map((stage) => {
        const active = activeStage === stage.id
        const count = memoryCounts[stage.id] ?? 0
        const icon = getStageIcon(stage.id)

        return (
          <button
            key={stage.id}
            onClick={() => onChange(stage.id)}
            className="group relative min-w-0 flex-1"
          >
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition sm:flex-row sm:justify-center sm:gap-1.5 sm:px-2 sm:py-2.5 ${
                active
                  ? 'bg-white text-violet-700 shadow-md shadow-violet-200/50'
                  : 'text-stone-500 hover:bg-white/60 hover:text-stone-700'
              }`}
            >
              <AppIcon
                config={icon}
                size={active ? 22 : 18}
                className={active ? 'text-violet-500' : 'text-stone-400'}
              />
              <span className="truncate text-[11px] font-medium sm:text-sm">
                {stage.shortLabel}
              </span>
              {count > 0 && (
                <span
                  className={`rounded-full px-1 py-0.5 text-[9px] font-semibold sm:text-[10px] ${
                    active ? 'bg-violet-100 text-violet-600' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </motion.div>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -bottom-1 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400 to-rose-400"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
