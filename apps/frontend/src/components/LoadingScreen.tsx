import { ISBLogo } from './ISBLogo'

export function LoadingScreen() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(253,250,245,0.96)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(59,40,0,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <ISBLogo size={36} />
            <div>
              <div
                className="text-[16px] font-bold leading-tight font-heading"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                ISBibliotheque
              </div>
              <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Bibliotheque d&apos;application
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div
            className="h-8 w-64 rounded-xl animate-pulse"
            style={{ backgroundColor: 'hsl(var(--muted))' }}
          />
          <div
            className="h-5 w-96 rounded-lg mt-2 animate-pulse"
            style={{ backgroundColor: 'hsl(var(--secondary))' }}
          />
        </div>
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 rounded-xl animate-pulse"
              style={{ backgroundColor: 'hsl(var(--secondary))' }}
            />
          ))}
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[rgba(59,40,0,0.08)] min-h-[180px]"
            >
              <div
                className="w-14 h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: 'hsl(var(--secondary))' }}
              />
              <div
                className="h-5 w-20 rounded-full animate-pulse"
                style={{ backgroundColor: 'hsl(var(--secondary))' }}
              />
              <div
                className="h-4 w-3/4 rounded-lg animate-pulse"
                style={{ backgroundColor: 'hsl(var(--muted))' }}
              />
              <div
                className="h-3 w-full rounded-lg animate-pulse"
                style={{ backgroundColor: 'hsl(var(--secondary))' }}
              />
              <div
                className="h-3 w-2/3 rounded-lg animate-pulse"
                style={{ backgroundColor: 'hsl(var(--secondary))' }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
