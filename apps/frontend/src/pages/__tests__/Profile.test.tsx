import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Profile from '@/pages/Profile'
import { ColorThemeProvider } from '@/contexts/ColorThemeContext'

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

const defaultUser = {
  email: 'jean.dupont@example.com',
  name: 'Jean Dupont',
  roles: ['user'] as string[],
  isAdmin: false,
}

function renderProfile() {
  return render(
    <ColorThemeProvider>
      <MemoryRouter>
        <Profile />
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
  mockProfile.mockResolvedValue({
    email: defaultUser.email,
    name: defaultUser.name,
    icon: '',
  })
})

describe('Profile avatar', () => {
  it('renders initials when icon is empty', async () => {
    renderProfile()

    const initials = await screen.findByText('JD')
    expect(initials).toBeInTheDocument()
  })

  it('renders image when icon is an image URL', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '/uploads/avatars/photo.jpg',
    })

    const { container } = renderProfile()

    await waitFor(() => {
      const img = container.querySelector<HTMLImageElement>('img[src="/uploads/avatars/photo.jpg"]')
      expect(img).not.toBeNull()
    })
  })

  it('renders emoji when icon is an emoji', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '🔥',
    })

    renderProfile()

    const emoji = await screen.findByText('🔥')
    expect(emoji).toBeInTheDocument()
  })

  it('shows initials fallback after image onError', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: defaultUser.name,
      icon: '/uploads/avatars/broken.jpg',
    })

    const { container } = renderProfile()

    // Wait for the image to render
    const avatarImg = await waitFor(() => {
      const img = container.querySelector<HTMLImageElement>('img[src="/uploads/avatars/broken.jpg"]')
      expect(img).not.toBeNull()
      return img!
    })

    // Simulate image load error — onError handler should clear icon to show initials
    avatarImg.dispatchEvent(new Event('error'))

    // After error, the icon state is cleared and initials should appear
    const initials = await screen.findByText('JD')
    expect(initials).toBeInTheDocument()

    // The broken img should no longer be in the DOM
    const brokenImg = container.querySelector<HTMLImageElement>('img[src="/uploads/avatars/broken.jpg"]')
    expect(brokenImg).toBeNull()
  })

  it('renders "??" initials when profile name is empty', async () => {
    mockProfile.mockResolvedValue({
      email: defaultUser.email,
      name: '',
      icon: '',
    })

    renderProfile()

    const initials = await screen.findByText('??')
    expect(initials).toBeInTheDocument()
  })
})
