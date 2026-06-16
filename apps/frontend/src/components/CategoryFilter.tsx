const ALL_CATEGORIES = [
  'Toutes',
  'Gestion',
  'Production',
  'RH',
  'Finance',
  'Qualité',
  'Logistique',
  'Commercial',
  'IT',
]

interface CategoryFilterProps {
  active: string
  count: number
  onSelect: (category: string) => void
}

export function CategoryFilter({ active, count, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap" role="tablist" aria-label="Catégories">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          role="tab"
          aria-selected={active === cat}
          className="px-4 py-2 rounded-xl transition-all text-[13px]"
          style={{
            fontWeight: active === cat ? 600 : 400,
            backgroundColor: active === cat ? '#3B2800' : '#FEEAD3',
            color: active === cat ? '#FFDD00' : '#8C6A40',
          }}
        >
          {cat}
        </button>
      ))}
      {count > 0 && (
        <span className="ml-auto text-[13px]" style={{ color: '#8C6A40' }}>
          {count} application{count > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}
