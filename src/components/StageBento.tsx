import { ArrowUpRight } from 'lucide-react'
import { getStageIcon } from '../constants/icons'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'
import { AppIcon } from './AppIcon'
import { ScrollFloat, SpotlightCard } from './reactbits'

interface StageBentoProps {
  activeStage: StageId
  memoryCounts: Record<StageId, number>
  onStageChange: (id: StageId) => void
}

export function StageBento({
  activeStage,
  memoryCounts,
  onStageChange,
}: StageBentoProps) {
  const totalMemories = Object.values(memoryCounts).reduce((a, b) => a + b, 0)
  const activeStageInfo = STAGES.find((s) => s.id === activeStage) ?? STAGES[0]

  return (
    <section className="page-shell w-full py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.3em] text-white/35">
            TIME ALBUM
          </p>
          <ScrollFloat
            scrollStart="top 90%"
            scrollEnd="top 58%"
            className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl"
          >
            时光专辑
          </ScrollFloat>
        </div>
        <span className="shrink-0 text-xs text-white/30">{totalMemories} 条回忆</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-6 xl:gap-5">
        <div data-scroll-unroll className="col-span-2 row-span-2 xl:col-span-3">
          <SpotlightCard
            className="group h-full min-h-[220px] rounded-xl border border-white/[0.06] bg-[#141414] p-6"
            spotlightColor="rgba(255,255,255,0.06)"
          >
            <button
              onClick={() => onStageChange(activeStageInfo.id)}
              className="flex h-full w-full flex-col text-left"
            >
              <div className="mb-4 flex items-center justify-between">
                <AppIcon
                  config={getStageIcon(activeStageInfo.id)}
                  size={24}
                  className="text-white/70"
                />
                <ArrowUpRight className="h-4 w-4 text-white/20 transition group-hover:text-white/60" />
              </div>
              <p className="text-[10px] tracking-[0.2em] text-white/35">CURRENT</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                {activeStageInfo.label}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">
                {activeStageInfo.quote}
              </p>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[10px] text-white/30">
                  <span>回忆进度</span>
                  <span>{activeStageInfo.progress}%</span>
                </div>
                <div className="h-px overflow-hidden bg-white/10">
                  <div
                    className="h-full bg-white/50 transition-all duration-700"
                    style={{ width: `${activeStageInfo.progress}%` }}
                  />
                </div>
              </div>
            </button>
          </SpotlightCard>
        </div>

        <div data-scroll-unroll className="col-span-2 md:col-span-2 xl:col-span-3">
          <SpotlightCard
            className="h-full min-h-[120px] rounded-xl border border-white/[0.06] bg-[#141414] p-6"
            spotlightColor="rgba(255,255,255,0.05)"
          >
            <div className="border-l-2 border-white/20 pl-5">
              <p className="font-serif text-lg italic leading-relaxed text-white/70">
                「{activeStageInfo.description}」
              </p>
            </div>
          </SpotlightCard>
        </div>

        {STAGES.map((stage) => {
          const active = activeStage === stage.id
          const count = memoryCounts[stage.id] ?? 0
          return (
            <div key={stage.id} data-scroll-unroll className="col-span-1">
              <SpotlightCard
                className={`h-full rounded-xl border p-4 transition ${
                  active
                    ? 'border-white/20 bg-[#1a1a1a]'
                    : 'border-white/[0.06] bg-[#111111] hover:border-white/10'
                }`}
                spotlightColor="rgba(255,255,255,0.04)"
              >
                <button
                  onClick={() => onStageChange(stage.id)}
                  className="flex h-full w-full flex-col items-start text-left"
                >
                  <AppIcon
                    config={getStageIcon(stage.id)}
                    size={18}
                    className={active ? 'text-white' : 'text-white/40'}
                  />
                  <span
                    className={`mt-3 text-sm font-medium ${
                      active ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {stage.shortLabel}
                  </span>
                  <span className="mt-1 text-[10px] text-white/25">
                    {count > 0 ? `${count} 条回忆` : '暂无记录'}
                  </span>
                </button>
              </SpotlightCard>
            </div>
          )
        })}
      </div>
    </section>
  )
}
