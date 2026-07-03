export type AppAccessType = 'redirect' | 'docker'

export interface AppManifest {
  id: string
  name: string
  description: string
  category: string
  icon: string
  access: AppRedirectAccess | AppDockerAccess
  roles: string[]
  sso?: boolean
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
  host?: string
  healthUrl?: string
}

export interface AppResponse {
  id: string
  name: string
  description: string
  category: string
  icon: string
  roles: string[]
  accessType: AppAccessType
  url: string | null
  status: string | null
  sso: boolean
}
