import { memo } from 'react'
import { Plasma } from './Plasma'

const LoginBackground = memo(function LoginBackground() {
  return (
    <>
      <div className="absolute inset-0">
        <Plasma
          color="#b497cf"
          speed={1}
          direction="forward"
          scale={1}
          opacity={1}
          mouseInteractive={false}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/70" />
    </>
  )
})

export default LoginBackground
