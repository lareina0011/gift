import { LogOut, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { STAGES } from '../constants/stages'
import { useMemories } from '../hooks/useMemories'
import { hasSeenWelcome, markWelcomeSeen } from '../utils/storage'
import type { StageId } from '../types'
import { Particles } from './Particles'
import { ProfilePanel } from './ProfilePanel'
import { ProgressBar } from './ProgressBar'
import { BlurText } from './reactbits'
import { StageContent } from './StageContent'
import { StageTabs } from './StageTabs'
import { WelcomeOverlay } from './WelcomeOverlay'

interface MainLayoutProps {
  currentUser: string
  onLogout: () => void
  onChangePassword: (
    oldPassword: string,
    newPassword: string,
  ) => { ok: boolean; message: string }
}

export function MainLayout({
  currentUser,
  onLogout,
  onChangePassword,
}: MainLayoutProps) {
  const [activeStage, setActiveStage] = useState<StageId>('primary')
  const [showProfile, setShowProfile] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const {
    ready,
    wishes,
    addMemory,
    deleteMemory,
    addWish,
    deleteWish,
    getMemoriesByStage,
    getMemoryCount,
  } = useMemories()

  useEffect(() => {
    if (!hasSeenWelcome()) {
      setShowWelcome(true)
    }
  }, [])

  const memoryCounts = useMemo(() => {
    const counts = {} as Record<StageId, number>
    STAGES.forEach((s) => {
      counts[s.id] = getMemoryCount(s.id)
    })
    return counts
  }, [getMemoryCount])

  const stageMemories = getMemoriesByStage(activeStage)

  const handleStageChange = (id: StageId) => {
    setActiveStage(id)
    setShowProfile(false)
  }

  const handleWelcomeClose = () => {
    markWelcomeSeen()
    setShowWelcome(false)
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-violet-100">
        <div className="text-center">
          <div className="mb-3 text-4xl animate-pulse">🎓</div>
          <p className="text-stone-500">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* React Bits 风格粒子背景 */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Particles
          particleCount={80}
          speed={0.06}
          particleColors={['#e9d5ff', '#fbcfe8', '#ddd6fe', '#fde68a']}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/90 via-amber-50/70 to-violet-100/90" />

      <header className="relative sticky top-0 z-40 border-b border-white/40 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BlurText
            text={APP_CONFIG.siteTitle}
            className="font-serif text-lg font-bold text-stone-800 sm:text-xl"
            animateBy="letters"
            delay={50}
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowProfile(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                showProfile
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-stone-500 hover:bg-white/80 hover:text-stone-700'
              }`}
            >
              <User className="h-4 w-4" />
              <span>我的</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-stone-400 transition hover:bg-white/80 hover:text-stone-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>

        {!showProfile && (
          <div className="mx-auto mt-3 max-w-5xl">
            <StageTabs
              activeStage={activeStage}
              onChange={handleStageChange}
              memoryCounts={memoryCounts}
            />
          </div>
        )}
      </header>

      <div className="relative flex flex-1 flex-col">
        {showProfile ? (
          <ProfilePanel username={currentUser} onChangePassword={onChangePassword} />
        ) : (
          <StageContent
            stageId={activeStage}
            memories={stageMemories}
            wishes={wishes}
            onAddMemory={async (data) => {
              await addMemory(activeStage, data)
            }}
            onDeleteMemory={deleteMemory}
            onAddWish={addWish}
            onDeleteWish={deleteWish}
          />
        )}

        {!showProfile && (
          <ProgressBar activeStage={activeStage} onStageChange={handleStageChange} />
        )}
      </div>

      <WelcomeOverlay open={showWelcome} onClose={handleWelcomeClose} />
    </div>
  )
}
