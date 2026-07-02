// Set JWT secret before any imports so config picks it up
vi.hoisted(() => {
  process.env.JWT_SECRET = 'test-secret-for-testing'
})

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import type express from 'express'
import type { SuperTest, Test } from 'supertest'
import { createToken } from '../../utils/jwt.js'

// Prisma mock — hoisted so factory can reference the spies.
// vi.mock must be registered at module evaluation time before ESM
// imports resolve; the factory replaces the prisma module entirely.
const { mockFindUnique, mockUpsert } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockUpsert: vi.fn(),
}))

vi.mock('../../services/db.js', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      upsert: mockUpsert,
    },
  },
}))

// Dynamic import for createApp: vitest hoists vi.mock above static
// imports, but ESM resolves all static imports before module code runs.
// Dynamic import defers loading until after vi.mock is registered,
// ensuring the prisma mock intercepts the module graph.
async function loadApp(): Promise<express.Application> {
  const { createApp } = await import('../../app.js')
  return createApp()
}

describe('Auth Profile Routes', () => {
  let app: express.Application
  let request: ReturnType<typeof supertest>
  let authToken: string

  beforeAll(async () => {
    app = await loadApp()
    request = supertest(app)

    authToken = createToken({
      sub: 'test@example.com',
      email: 'test@example.com',
      name: 'Test User',
      roles: [],
      isAdmin: false,
    })
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /auth/profile', () => {
    it('should return 401 without authentication', async () => {
      const res = await request.get('/api/auth/profile')
      expect(res.status).toBe(401)
    })

    it('should return profile with icon field as image URL', async () => {
      mockFindUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        icon: '/uploads/avatars/avatar-123.jpg',
      })

      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(res.body.profile).toBeDefined()
      expect(res.body.profile.email).toBe('test@example.com')
      expect(res.body.profile.name).toBe('Test User')
      expect(res.body.profile.icon).toBe('/uploads/avatars/avatar-123.jpg')
    })

    it('should return empty icon when no avatar set', async () => {
      mockFindUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        icon: '',
      })

      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(res.body.profile.icon).toBe('')
    })

    it('should return emoji icon when set via profile update', async () => {
      mockFindUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        icon: '🚀',
      })

      const res = await request
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(res.body.profile.icon).toBe('🚀')
    })
  })

  describe('POST /auth/profile/avatar', () => {
    it('should return 401 without authentication', async () => {
      const res = await request.post('/api/auth/profile/avatar')
      expect(res.status).toBe(401)
    })

    it('should upload avatar and persist icon in database', async () => {
      mockUpsert.mockImplementation(
        (args: { update: { icon: string }; create: { icon: string } }) =>
          Promise.resolve({
            email: 'test@example.com',
            name: 'Test User',
            icon: args.update.icon ?? args.create.icon,
          }),
      )
      const res = await request
        .post('/api/auth/profile/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('avatar', Buffer.from('fake-image-content'), 'avatar.jpg')

      expect(res.status).toBe(200)
      expect(res.body.profile).toBeDefined()
      expect(res.body.profile.icon).toMatch(/^\/uploads\/avatars\//)
      expect(res.body.url).toMatch(/^\/uploads\/avatars\//)

      // Verify upsert was called (upsertProfile uses mocked prisma)
      expect(mockUpsert).toHaveBeenCalledTimes(1)
    })

    it('should return 400 when no file is provided', async () => {
      const res = await request
        .post('/api/auth/profile/avatar')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(400)
    })

    it('should return 400 for unsupported file type', async () => {
      const res = await request
        .post('/api/auth/profile/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('avatar', Buffer.from('not-an-image'), 'test.txt')

      expect(res.status).toBe(400)
      expect(res.body.error).toBeDefined()
      expect(res.body.error.message).toContain('non supporté')
    })
  })
})
