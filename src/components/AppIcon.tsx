import type { LucideIcon } from 'lucide-react'
import type { IconConfig } from '../constants/icons'

interface AppIconProps {
  config: IconConfig | { emoji: string; customSrc: string | null; lucide?: LucideIcon }
  className?: string
  imgClassName?: string
  size?: number
}

export function AppIcon({
  config,
  className = '',
  imgClassName = '',
  size = 20,
}: AppIconProps) {
  if (config.customSrc) {
    return (
      <img
        src={config.customSrc}
        alt=""
        className={`object-contain ${imgClassName || className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  if ('lucide' in config && config.lucide) {
    const Icon = config.lucide
    return <Icon className={className} size={size} strokeWidth={1.75} />
  }

  return (
    <span className={className} style={{ fontSize: size * 0.9, lineHeight: 1 }}>
      {config.emoji}
    </span>
  )
}
