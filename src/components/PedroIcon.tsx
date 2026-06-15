'use client'

import { useState } from 'react'

interface PedroIconProps {
  day: number
  customIcon?: string
  className?: string
}

export default function PedroIcon({ day, customIcon, className }: PedroIconProps) {
  const dayStr = String(day).padStart(2, '0')
  const defaultWebp = `/icons/pedro-${dayStr}.webp`
  const defaultPng = `/icons/pedro-${dayStr}.png`
  
  const [imgSrc, setImgSrc] = useState(customIcon ? `/icons/${customIcon}` : defaultWebp)
  const [status, setStatus] = useState<'trying' | 'fallback-png' | 'emoji'>('trying')

  const handleError = () => {
    if (status === 'trying') {
      setImgSrc(defaultPng)
      setStatus('fallback-png')
    } else {
      setStatus('emoji')
    }
  }

  if (status === 'emoji') {
    return <span className="text-2xl" aria-hidden="true">🎁</span>
  }

  return (
    <img
      src={imgSrc}
      alt={`Week ${day}`}
      className={className}
      onError={handleError}
    />
  )
}
