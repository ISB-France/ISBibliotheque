interface AppCardProps {
  name: string
  description: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
  color: string
  bgColor: string
  category: string
  isLaunching?: boolean
  onClick?: () => void
}

const categoryColors: Record<string, { color: string; bgColor: string }> = {
  Gestion: { color: 'hsl(var(--foreground))', bgColor: 'hsl(var(--muted))' },
  Production: { color: 'hsl(var(--destructive))', bgColor: 'hsl(var(--accent))' },
  RH: { color: 'hsl(var(--muted-foreground))', bgColor: 'hsl(var(--secondary))' },
  Finance: { color: 'hsl(var(--destructive))', bgColor: 'hsl(var(--accent))' },
  Qualité: { color: 'hsl(var(--muted-foreground))', bgColor: 'hsl(var(--secondary))' },
  Logistique: { color: 'hsl(var(--muted-foreground))', bgColor: 'hsl(var(--muted))' },
  Commercial: { color: 'hsl(var(--muted-foreground))', bgColor: 'hsl(var(--muted))' },
  IT: { color: 'hsl(var(--foreground))', bgColor: 'hsl(var(--muted))' },
}

export function getAppStyle(category: string) {
  return (
    categoryColors[category] ?? {
      color: 'hsl(var(--muted-foreground))',
      bgColor: 'hsl(var(--secondary))',
    }
  )
}

export { categoryColors }

export function AppCard({
  name,
  description,
  icon: Icon,
  color,
  bgColor,
  category,
  isLaunching,
  onClick,
}: AppCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLaunching}
      className="group relative flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border border-[rgba(59,40,0,0.08)] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] active:shadow-sm transition-all duration-200 text-left w-full cursor-pointer disabled:opacity-60 disabled:cursor-wait"
    >
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={26} style={{ color }} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className="text-[13px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'hsl(var(--secondary))',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            {category}
          </span>
        </div>
        <h3
          className="text-[15px] font-semibold mt-1.5 leading-tight"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          {name}
        </h3>
        <p
          className="text-[13px] mt-1 leading-relaxed"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          {description}
        </p>
      </div>

      {isLaunching && (
        <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-isb-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="pointer-events-none absolute -bottom-3 left-6 right-6 h-6 rounded-full bg-isb-yellow blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
    </button>
  )
}
