import { LogOut, User } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { STAGES } from '../constants/stages'
import { useBackgroundImages } from '../hooks/useBackgroundImages'
import { useIntroMedia } from '../hooks/useIntroMedia'
import { useMemories } from '../hooks/useMemories'
import { useProfileAvatar } from '../hooks/useProfileAvatar'
import { hasPlayedIntroThisSession } from '../utils/introMedia'
import {
  hasSeenWelcome,
  hasWelcomeUserThisSession,
  markWelcomeSeen,
  markWelcomeUserThisSession,
} from '../utils/storage'
import type { StageId } from '../types'
import { DesignCredit } from './DesignCredit'
import { HeroCover } from './HeroCover'
import { LoginIntroOverlay } from './LoginIntroOverlay'
import { MemoryOrbitGallery } from './MemoryOrbitGallery'
import { ProfilePanel } from './ProfilePanel'
import { ProgressBar } from './ProgressBar'
import { StageBento } from './StageBento'
import { ScrollUnrollSection } from './ScrollUnrollSection'
import { StageContent } from './StageContent'
import { StageTabs } from './StageTabs'
import { StageTransition } from './StageTransition'
import { WelcomeOverlay } from './WelcomeOverlay'
import { WelcomeUserOverlay } from './WelcomeUserOverlay'

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
  const [transitionTarget, setTransitionTarget] = useState<StageId | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showWelcomeUser, setShowWelcomeUser] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const {
    ready,
    memories,
    wishes,
    addMemory,
    deleteMemory,
    addWish,
    deleteWish,
    getMemoriesByStage,
    getMemoryCount,
  } = useMemories()

  const {
    loginBgUrl,
    heroCoverUrl,
    hasCustomLogin,
    hasCustomHero,
    defaultHeroUrl,
    defaultLoginUrl,
    uploadBackground,
    removeBackground,
  } = useBackgroundImages()

  const {
    ready: introReady,
    introImageUrl,
    introAudioUrl,
    hasIntroImage,
    hasCustomIntroAudio,
    defaultIntroAudioUrl,
    hasIntroMedia,
    uploadIntroMedia,
    removeIntroMedia,
  } = useIntroMedia()

  const {
    avatarUrl,
    hasCustomAvatar,
    uploadAvatar,
    removeAvatar,
  } = useProfileAvatar(currentUser)

  useEffect(() => {
    if (!ready || !introReady) return
    if (hasIntroMedia && !hasPlayedIntroThisSession()) {
      setShowIntro(true)
      return
    }
    if (!hasWelcomeUserThisSession()) {
      setShowWelcomeUser(true)
    } else if (!hasSeenWelcome()) {
      setShowWelcome(true)
    }
  }, [ready, introReady, hasIntroMedia])

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    setShowWelcomeUser(true)
  }, [])

  const handleWelcomeUserComplete = useCallback(() => {
    markWelcomeUserThisSession()
    setShowWelcomeUser(false)
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

  const handleTransitionComplete = useCallback(() => {
    if (transitionTarget) {
      setActiveStage(transitionTarget)
      setTransitionTarget(null)
    }
  }, [transitionTarget])

  const handleStageChange = useCallback(
    (id: StageId, skipTransition = false) => {
      if (id === activeStage && !transitionTarget) return
      setShowProfile(false)
      if (skipTransition || transitionTarget) {
        setTransitionTarget(null)
        setActiveStage(id)
        return
      }
      setTransitionTarget(id)
    },
    [activeStage, transitionTarget],
  )

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleWelcomeClose = () => {
    markWelcomeSeen()
    setShowWelcome(false)
  }

  if (!ready || !introReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm tracking-widest text-white/40">加载中...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroCoverUrl ?? defaultHeroUrl})` }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0a0a]/40" />

      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="page-shell flex items-center justify-between py-5">
          <span className="font-serif text-sm font-semibold tracking-wide text-white/90 sm:text-base">
            {APP_CONFIG.siteTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(true)}
              className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs tracking-wider transition ${
                showProfile
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              我的
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs tracking-wider text-white/40 transition hover:text-white/70"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出
            </button>
          </div>
        </div>
      </header>

      <StageTransition
        targetStage={transitionTarget}
        fromStage={activeStage}
        onComplete={handleTransitionComplete}
      />

      {showProfile ? (
        <ProfilePanel
          username={currentUser}
          avatarUrl={avatarUrl}
          hasCustomAvatar={hasCustomAvatar}
          uploadAvatar={uploadAvatar}
          removeAvatar={removeAvatar}
          onChangePassword={onChangePassword}
          loginPreviewUrl={loginBgUrl ?? defaultLoginUrl}
          heroPreviewUrl={heroCoverUrl ?? defaultHeroUrl}
          hasCustomLogin={hasCustomLogin}
          hasCustomHero={hasCustomHero}
          uploadBackground={uploadBackground}
          removeBackground={removeBackground}
          introImagePreviewUrl={introImageUrl}
          introAudioPreviewUrl={introAudioUrl}
          hasIntroImage={hasIntroImage}
          hasCustomIntroAudio={hasCustomIntroAudio}
          defaultIntroAudioUrl={defaultIntroAudioUrl}
          uploadIntroMedia={uploadIntroMedia}
          removeIntroMedia={removeIntroMedia}
        />
      ) : (
        <>
          <HeroCover
            ref={heroRef}
            onExplore={scrollToContent}
            onFuture={() => {
              handleStageChange('future')
              setTimeout(scrollToContent, 100)
            }}
          />

          <ScrollUnrollSection triggerRef={heroRef}>
            <StageBento
              activeStage={activeStage}
              memoryCounts={memoryCounts}
              onStageChange={(id) => {
                handleStageChange(id)
                scrollToContent()
              }}
            />

            <div ref={contentRef} className="border-t border-white/[0.06]">
            <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/90 py-3 backdrop-blur-md">
              <div className="page-shell">
                <StageTabs
                  activeStage={activeStage}
                  onChange={handleStageChange}
                  memoryCounts={memoryCounts}
                />
              </div>
            </div>

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

            <MemoryOrbitGallery memories={memories} />

            <ProgressBar activeStage={activeStage} onStageChange={handleStageChange} />
            </div>
          </ScrollUnrollSection>
        </>
      )}

      <LoginIntroOverlay
        open={showIntro}
        imageUrl={introImageUrl}
        audioUrl={introAudioUrl}
        onComplete={handleIntroComplete}
        onUploadAudio={(file) => uploadIntroMedia('audio', file)}
      />

      <WelcomeUserOverlay
        open={showWelcomeUser}
        username={currentUser}
        onComplete={handleWelcomeUserComplete}
      />

      <WelcomeOverlay open={showWelcome} onClose={handleWelcomeClose} />

      <DesignCredit />
    </div>
  )
}
