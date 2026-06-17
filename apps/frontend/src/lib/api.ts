const BASE_URL = '/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body?.error?.message ?? res.statusText, body?.error)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export interface AuthUser {
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
}

export interface AppManifest {
  id: string
  name: string
  description: string
  category: string
  icon: string
  access: AppRedirectAccess | AppDockerAccess
  roles: string[]
}

export interface AppRedirectAccess {
  type: 'redirect'
  url: string
}

export interface AppDockerAccess {
  type: 'docker'
  composeFile: string
  serviceName: string
  internalPort: number
  healthUrl?: string
}

export interface AppResponse {
  id: string
  name: string
  description: string
  category: string
  icon: string
  roles: string[]
  accessType: 'redirect' | 'docker'
  url: string | null
  status: string | null
}

export interface UserProfile {
  email: string
  name: string
  icon: string
}

export interface DockerStatus {
  status: 'running' | 'stopped' | 'error'
  url: string | null
  message?: string
}

export const api = {
  groups: {
    list: () => request<{ groups: Array<{ name: string; description: string }> }>('/groups').then(r => r.groups),
  },
  auth: {
    me: () => request<{ user: AuthUser }>('/auth/me').then(r => r.user),
    logout: () => request<{ message: string; logoutUrl?: string }>('/auth/logout', { method: 'POST' }),
    profile: () =>
      request<{ profile: UserProfile }>('/auth/profile').then(r => r.profile),
    updateProfile: (data: { name?: string; icon?: string }) =>
      request<{ profile: UserProfile; user: AuthUser }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    loginAdmin: (email: string, password: string) =>
      request<{ token: string; email: string; name: string; roles: string[]; isAdmin: boolean }>(
        '/auth/login-admin',
        { method: 'POST', body: JSON.stringify({ email, password }) },
      ),
  },
  apps: {
    list: () => request<{ apps: AppResponse[] }>('/apps').then(r => r.apps),
    categories: () => request<{ categories: string[] }>('/apps/categories').then(r => r.categories),
  },
  admin: {
    listApps: () => request<{ apps: AppResponse[] }>('/admin/apps').then(r => r.apps),
    createApp: (data: Partial<AppManifest>) =>
      request<{ app: AppManifest }>('/admin/apps', { method: 'POST', body: JSON.stringify(data) }).then(r => r.app),
    updateApp: (id: string, data: Partial<AppManifest>) =>
      request<{ app: AppManifest }>(`/admin/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.app),
    deleteApp: (id: string) => request<void>(`/admin/apps/${id}`, { method: 'DELETE' }),
    listGroups: () => request<{ groups: Array<{ name: string; description: string; members: string[] }> }>('/admin/groups').then(r => r.groups),
    createGroup: (data: { name: string; description: string }) =>
      request<{ group: { name: string; description: string; members: string[] } }>('/admin/groups', { method: 'POST', body: JSON.stringify(data) }).then(r => r.group),
    updateGroup: (name: string, data: { name?: string; description?: string; members?: string[] }) =>
      request<{ group: { name: string; description: string; members: string[] } }>(`/admin/groups/${encodeURIComponent(name)}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.group),
    deleteGroup: (name: string) => request<void>(`/admin/groups/${encodeURIComponent(name)}`, { method: 'DELETE' }),
    addGroupMember: (groupName: string, email: string) =>
      request<{ group: { name: string; description: string; members: string[] } }>(`/admin/groups/${encodeURIComponent(groupName)}/members`, { method: 'POST', body: JSON.stringify({ email }) }).then(r => r.group),
    removeGroupMember: (groupName: string, email: string) =>
      request<{ group: { name: string; description: string; members: string[] } }>(`/admin/groups/${encodeURIComponent(groupName)}/members/${encodeURIComponent(email)}`, { method: 'DELETE' }).then(r => r.group),
    listProfiles: () =>
      request<{ profiles: UserProfile[] }>('/admin/profiles').then(r => r.profiles),
    updateProfile: (email: string, data: { name?: string; icon?: string; email?: string }) =>
      request<{ profile: UserProfile }>(`/admin/profiles/${encodeURIComponent(email)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(r => r.profile),
  },
  docker: {
    start: (id: string) =>
      request<{ status: DockerStatus }>(`/apps/${id}/start`, { method: 'POST' }),
    stop: (id: string) => request<{ status: DockerStatus }>(`/apps/${id}/stop`, { method: 'POST' }),
    status: (id: string) => request<{ status: DockerStatus }>(`/apps/${id}/status`),
  },
}
