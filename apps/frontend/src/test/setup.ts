import '@testing-library/jest-dom'

// jsdom in vitest 4.x doesn't provide localStorage by default
if (typeof localStorage === 'undefined' || localStorage === null) {
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = String(value) },
      removeItem: (key: string) => { delete store[key] },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
      length: 0,
      key: (_: number) => null,
    },
    writable: true,
    configurable: true,
  })
}
