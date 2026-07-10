import { memo } from 'react'

interface LoginBackgroundProps {
  imageUrl?: string | null
}

const LoginBackground = memo(function LoginBackground({ imageUrl }: LoginBackgroundProps) {
  return (
    <>
      {imageUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-[8] bg-gradient-to-b ${
          imageUrl
            ? 'from-[#0a0a0f]/50 via-[#1a1028]/15 to-[#0a0a0f]/75'
            : 'from-[#0a0a0f]/35 via-[#12081c]/20 to-[#0a0a0f]/70'
        }`}
      />
    </>
  )
})

export default LoginBackground
