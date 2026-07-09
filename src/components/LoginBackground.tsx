import { memo, type RefObject } from 'react'
import { Plasma } from './Plasma'

interface LoginBackgroundProps {
  imageUrl?: string | null
  pauseRef?: RefObject<boolean>
}

const LoginBackground = memo(function LoginBackground({
  imageUrl,
  pauseRef,
}: LoginBackgroundProps) {
  return (
    <>
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      <div className="absolute inset-0" style={{ contain: 'strict' }}>
        <Plasma
          color="#b497cf"
          speed={1}
          direction="forward"
          scale={1}
          opacity={imageUrl ? 0.38 : 1}
          mouseInteractive={false}
          maxDpr={1}
          pauseRef={pauseRef}
        />
      </div>

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${
          imageUrl
            ? 'from-[#0a0a0f]/50 via-[#0a0a0f]/20 to-[#0a0a0f]/75'
            : 'from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/70'
        }`}
      />
    </>
  )
})

export default LoginBackground
