import { LogOut, Mail, User } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { getStageBackground } from '../constants/stageBackgrounds'
import { STAGES } from '../constants/stages'
import { useBackgroundImages } from '../hooks/useBackgroundImages'
import { useBgm } from '../hooks/useBgm'
import { useIntroMedia } from '../hooks/useIntroMedia'
import { useLetter } from '../hooks/useLetter'
import { useMemories } from '../hooks/useMemories'
import { useProfileAvatar } from '../hooks/useProfileAvatar'
import { useStageAssets } from '../hooks/useStageAssets'
import { useStageBlessings } from '../hooks/useStageBlessings'
import {
  hasPlayedBlessingThisSession,
  markBlessingPlayedThisSession,
} from '../utils/blessingSession'
import { hasPlayedIntroThisSession } from '../utils/introMedia'
import {
  hasSeenWelcome,
  hasWelcomeUserThisSession,
  markWelcomeSeen,
  markWelcomeUserThisSession,
} from '../utils/storage'
import type { StageId } from '../types'
import { BgmControl } from './BgmControl'
import { DesignCredit } from './DesignCredit'
import { HeroCover } from './HeroCover'
import { LetterPanel } from './LetterPanel'
import { LoginIntroOverlay } from './LoginIntroOverlay'
import { MemoryOrbitGallery } from './MemoryOrbitGallery'
import { ProfilePanel } from './ProfilePanel'
import { ProgressBar } from './ProgressBar'
import { StageBento } from './StageBento'
import { StageBlessingPlayer } from './StageBlessingPlayer'
import { ScrollUnrollSection } from './ScrollUnrollSection'
import { ShareCardModal } from './ShareCardModal'
import { StageContent } from './StageContent'
import { StageTabs } from './StageTabs'
import { StageTransition } from './StageTransition'
import { WelcomeOverlay } from './WelcomeOverlay'
import { WelcomeUserOverlay } from './WelcomeUserOverlay'

interface MainLayoutProps {
  currentUser: string
  isEditor: boolean
  onLogout: () => void
  onChangePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message: string }>
}

export function MainLayout({
  currentUser,
  isEditor,
  onLogout,
  onChangePassword,
}: MainLayoutProps) {
  const [activeStage, setActiveStage] = useState<StageId>('primary')
  const [transitionTarget, setTransitionTarget] = useState<StageId | null>(null)
  const [blessingTarget, setBlessingTarget] = useState<StageId | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showWelcomeUser, setShowWelcomeUser] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const {
    ready,
    error: dataError,
    memories,
    wishes,
    reload,
    addMemory,
    editMemory,
    deleteMemory,
    addWish,
    editWish,
    deleteWish,
    getMemoriesByStage,
    getMemoryCount,
  } = useMemories()

  const {
    ready: blessingsReady,
    blessings,
    getByStage,
    addBlessing,
    deleteBlessing,
  } = useStageBlessings()

  const { ready: letterReady, letter, saveLetter, addVoice, removeVoice } = useLetter()
  const {
    ready: stageAssetsReady,
    bgUrls,
    iconUrls,
    uploadStageBg,
    removeStageBg,
    uploadStageIcon,
    removeStageIcon,
  } = useStageAssets()

  const {
    ready: bgmReady,
    hasBgm,
    url: bgmUrl,
    playing: bgmPlaying,
    enabled: bgmEnabled,
    volume: bgmVolume,
    audioRef: bgmAudioRef,
    toggle: toggleBgm,
    setVolume: setBgmVolume,
    pauseForIntro,
    resumeAfterIntro,
    uploadBgm,
    removeBgm,
  } = useBgm()

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
    if (!ready || !introReady || !blessingsReady || !letterReady || !stageAssetsReady || !bgmReady) {
      return
    }
    if (hasIntroMedia && !hasPlayedIntroThisSession()) {
      pauseForIntro()
      setShowIntro(true)
      return
    }
    if (!hasWelcomeUserThisSession()) {
      setShowWelcomeUser(true)
    } else if (!hasSeenWelcome()) {
      setShowWelcome(true)
    }
  }, [
    ready,
    introReady,
    blessingsReady,
    letterReady,
    stageAssetsReady,
    bgmReady,
    hasIntroMedia,
    pauseForIntro,
  ])

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    resumeAfterIntro()
    setShowWelcomeUser(true)
  }, [resumeAfterIntro])

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
  const pageBackground =
    bgUrls[activeStage] ??
    getStageBackground(activeStage) ??
    heroCoverUrl ??
    defaultHeroUrl

  const enterStage = useCallback(
    (id: StageId) => {
      const list = getByStage(id)
      if (list.length > 0 && !hasPlayedBlessingThisSession(id)) {
        setBlessingTarget(id)
        return
      }
      setActiveStage(id)
    },
    [getByStage],
  )

  const handleTransitionComplete = useCallback(() => {
    if (!transitionTarget) return
    const target = transitionTarget
    setTransitionTarget(null)
    enterStage(target)
  }, [transitionTarget, enterStage])

  const handleBlessingComplete = useCallback(() => {
    if (!blessingTarget) return
    markBlessingPlayedThisSession(blessingTarget)
    setActiveStage(blessingTarget)
    setBlessingTarget(null)
  }, [blessingTarget])

  const handleStageChange = useCallback(
    (id: StageId, skipTransition = false) => {
      if (id === activeStage && !transitionTarget && !blessingTarget) return
      setShowProfile(false)
      if (skipTransition || transitionTarget || blessingTarget) {
        setTransitionTarget(null)
        setBlessingTarget(null)
        setActiveStage(id)
        return
      }
      setTransitionTarget(id)
    },
    [activeStage, transitionTarget, blessingTarget],
  )

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleWelcomeClose = () => {
    markWelcomeSeen()
    setShowWelcome(false)
  }

  if (!ready || !introReady || !blessingsReady || !letterReady || !stageAssetsReady || !bgmReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm tracking-widest text-white/40">加载中...</p>
      </div>
    )
  }

  if (dataError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center">
        <p className="text-sm text-white/50">内容加载失败</p>
        <p className="max-w-sm text-xs leading-relaxed text-white/30">{dataError}</p>
        <button
          type="button"
          onClick={() => reload()}
          className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold tracking-wider text-black"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white">
      <div
        key={pageBackground}
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-[opacity,filter] duration-700"
        style={{ backgroundImage: `url(${pageBackground})` }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0a0a]/40" />

      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="page-shell flex items-center justify-between py-5">
          <span
            role="button"
            tabIndex={0}
            onClick={() => setShowProfile(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setShowProfile(false)
            }}
            className="cursor-pointer font-serif text-sm font-semibold tracking-wide text-white/90 transition hover:text-white sm:text-base"
          >
            {APP_CONFIG.siteTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLetter(true)}
              className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs tracking-wider text-white/50 transition hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              一封信
            </button>
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

      <StageBlessingPlayer
        stageId={blessingTarget}
        blessings={blessingTarget ? getByStage(blessingTarget) : []}
        onComplete={handleBlessingComplete}
      />

      {showProfile ? (
        <ProfilePanel
          username={currentUser}
          isEditor={isEditor}
          onBack={() => setShowProfile(false)}
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
          blessings={blessings}
          onAddBlessing={addBlessing}
          onDeleteBlessing={deleteBlessing}
          letter={letter}
          onSaveLetter={saveLetter}
          onAddLetterVoice={addVoice}
          onRemoveLetterVoice={removeVoice}
          stageBgUrls={bgUrls}
          stageIconUrls={iconUrls}
          onUploadStageBg={uploadStageBg}
          onRemoveStageBg={removeStageBg}
          onUploadStageIcon={uploadStageIcon}
          onRemoveStageIcon={removeStageIcon}
          hasBgm={hasBgm}
          bgmUrl={bgmUrl}
          onUploadBgm={uploadBgm}
          onRemoveBgm={removeBgm}
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
            onOpenLetter={() => setShowLetter(true)}
            onShareCard={() => setShowShareCard(true)}
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
                  iconUrls={iconUrls}
                />
              </div>
            </div>

            <StageContent
              stageId={activeStage}
              memories={stageMemories}
              wishes={wishes}
              isEditor={isEditor}
              stageIconUrl={iconUrls[activeStage] ?? null}
              onAddMemory={async (data) => {
                await addMemory(activeStage, data)
              }}
              onEditMemory={async (id, data) => {
                await editMemory(id, data)
              }}
              onDeleteMemory={deleteMemory}
              onAddWish={addWish}
              onEditWish={editWish}
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

      <LetterPanel open={showLetter} letter={letter} onClose={() => setShowLetter(false)} />
      <ShareCardModal open={showShareCard} onClose={() => setShowShareCard(false)} />

      <BgmControl
        hasBgm={hasBgm}
        enabled={bgmEnabled}
        playing={bgmPlaying}
        volume={bgmVolume}
        onToggle={toggleBgm}
        onVolume={setBgmVolume}
        audioRef={bgmAudioRef}
      />

      <DesignCredit />
    </div>
  )
}
