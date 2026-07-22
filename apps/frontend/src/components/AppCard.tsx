interface AppCardProps {
  name: string
  description: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
  isLaunching?: boolean
  onClick?: () => void
}

export function AppCard({ name, description, icon: Icon, isLaunching, onClick }: AppCardProps) {
  const color = 'hsl(var(--foreground))'
  const bgColor = 'hsl(var(--muted))'
  return (
    <button
      onClick={onClick}
      disabled={isLaunching}
      className="group relative flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border border-[rgba(59,40,0,0.08)] shadow-sm hover:shadow-[0_0_24px_-4px_hsl(var(--primary-foreground)/0.45)] hover:-translate-y-0.5 active:scale-[0.97] active:shadow-sm transition-all duration-200 text-left w-full cursor-pointer disabled:opacity-60 disabled:cursor-wait"
    >
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={26} style={{ color }} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="text-[15px] font-semibold leading-tight"
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
    </button>
  )
}
