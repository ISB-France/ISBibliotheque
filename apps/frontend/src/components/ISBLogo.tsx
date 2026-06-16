import { useEffect, useState } from 'react'
import logoWhite from '../../assets/Logo_isb_whitemode.png'
import logoDark from '../../assets/Logo_isb_darkmode.png'

export function ISBLogo({ size = 36 }: { size?: number }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <img
      src={dark ? logoWhite : logoDark}
      alt="ISB Group"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}
