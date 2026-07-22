import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as Lucide from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isIconComponent(value: unknown): value is LucideIcon {
  return (
    value != null &&
    (typeof value === 'function' || (typeof value === 'object' && '$$typeof' in value))
  )
}

export function lookupLucideIcon(name: string): LucideIcon | null {
  const icon = (Lucide as Record<string, unknown>)[name]
  return isIconComponent(icon) ? icon : null
}

export function getLucideIcon(name: string): LucideIcon {
  return lookupLucideIcon(name) ?? (Lucide.LayoutGrid as LucideIcon)
}
