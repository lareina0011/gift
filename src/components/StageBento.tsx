import { getStageIcon } from '../constants/icons'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'
import { AppIcon } from './AppIcon'
import { ScrollFloat, SpotlightCard } from './reactbits'

interface StageBentoProps {
  activeStage: StageId | null
}

export function StageBento({ activeStage }: StageBentoProps) {
  const activeStageInfo = activeStage ? STAGES.find((s) => s.id === activeStage) : null

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
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div data-scroll-unroll>
          <SpotlightCard
            className="h-full min-h-[200px] rounded-xl border glass-panel p-6"
            spotlightColor="rgba(255,255,255,0.06)"
          >
            <div className="flex h-full flex-col">
              <div className="mb-4">
                {activeStageInfo ? (
                  <AppIcon
                    config={getStageIcon(activeStageInfo.id)}
                    size={24}
                    className="text-white/70"
                  />
                ) : (
                  <span className="text-2xl text-white/50">✦</span>
                )}
              </div>
              <p className="text-[10px] tracking-[0.2em] text-white/35">
                {activeStageInfo ? 'CURRENT' : 'START'}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                {activeStageInfo ? activeStageInfo.label : '选择一章时光'}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">
                {activeStageInfo
                  ? activeStageInfo.quote
                  : '从童年到未来，每一段路都值得被轻轻翻开。在下方标签栏选一个阶段，开始记录。'}
              </p>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[10px] text-white/30">
                  <span>回忆进度</span>
                  <span>{activeStageInfo?.progress ?? 0}%</span>
                </div>
                <div className="h-px overflow-hidden bg-white/10">
                  <div
                    className="h-full bg-white/50 transition-all duration-700"
                    style={{ width: `${activeStageInfo?.progress ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        <div data-scroll-unroll>
          <SpotlightCard
            className="flex h-full min-h-[200px] items-center rounded-xl border glass-panel p-6"
            spotlightColor="rgba(255,255,255,0.05)"
          >
            <div className="border-l-2 border-white/20 pl-5">
              <p className="font-serif text-lg italic leading-relaxed text-white/70">
                「
                {activeStageInfo
                  ? activeStageInfo.description
                  : '愿细碎的时光，都被温柔留下。'}
                」
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
