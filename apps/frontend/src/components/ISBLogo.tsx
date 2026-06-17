import logoWhite from '../../assets/Logo_isb_whitemode.png'
import logoDark from '../../assets/Logo_isb_darkmode.png'
import { useColorTheme } from '@/contexts/ColorThemeContext'

export function ISBLogo({ size = 36 }: { size?: number }) {
  const { theme } = useColorTheme()

  return (
    <img
      src={theme.dark ? logoWhite : logoDark}
      alt="ISB Group"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}
