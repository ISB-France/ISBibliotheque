import { ISBLogo } from './ISBLogo'

export function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <ISBLogo size={22} />
          <span className="text-[13px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
            &copy; 2026 ISB Group — ISBibliotheque
          </span>
        </div>
        <div className="flex items-center gap-4">
          {['Support', 'Documentation', "Conditions d'utilisation"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[12px] hover:underline"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
