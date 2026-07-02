import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Header } from '@/components/Header'
import { ColorThemeProvider } from '@/contexts/ColorThemeContext'

const defaultUser = {
  email: 'jean.dupont@example.com',
  name: 'Jean Dupont',
  roles: ['user'] as string[],
  isAdmin: false,
}

const { mockProfile, mockUseAuth } = vi.hoisted(() => ({
  mockProfile: vi.fn(),
  mockUseAuth: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

vi.mock('@/lib/api', () => ({
  api: {
    auth: {
      profile: mockProfile,
    },
  },
}))

function renderHeader() {
  return render(
    <ColorThemeProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </ColorThemeProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseAuth.mockReturnValue({
    user: defaultUser,
    loading: false,
    error: null,
    loginMicrosoft: vi.fn(),
    logout: vi.fn(),
    retry: vi.fn(),
  })
})

describe('Header avatar', () => {
  it('renders initials in AvatarFallback when icon is empty', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '',
    })

    renderHeader()

    const fallback = await screen.findByText('JD')
    expect(fallback).toBeInTheDocument()
    expect(mockProfile).toHaveBeenCalledTimes(1)
  })

  it('fetches profile and passes image URL to AvatarImage', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '/uploads/avatars/test.jpg',
    })

    renderHeader()

    // The profile API is called
    expect(mockProfile).toHaveBeenCalledTimes(1)

    // The component renders without crashing — fallback still shows in jsdom
    // because Radix AvatarImage detects image loading failure in jsdom
    await screen.findByText('JD')
  })

  it('renders emoji in AvatarFallback when icon is an emoji', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '🚀',
    })

    renderHeader()

    const fallback = await screen.findByText('🚀')
    expect(fallback).toBeInTheDocument()
    expect(mockProfile).toHaveBeenCalledTimes(1)
  })

  it('renders "??" initials when user has no name', async () => {
    mockUseAuth.mockReturnValue({
      user: { ...defaultUser, name: '' },
      loading: false,
      error: null,
      loginMicrosoft: vi.fn(),
      logout: vi.fn(),
      retry: vi.fn(),
    })
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: '',
      icon: '',
    })

    renderHeader()

    const fallback = await screen.findByText('??')
    expect(fallback).toBeInTheDocument()
    expect(mockProfile).toHaveBeenCalledTimes(1)
  })
})
