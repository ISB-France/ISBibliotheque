import { logger } from '../utils/logger.js'
import type { AuthUser } from '../middleware/auth.js'

export type Action =
  | 'view_apps'
  | 'launch_app'
  | 'admin_add_app'
  | 'admin_manage_apps'
  | 'admin_manage_groups'

const roleActions: Record<string, Action[]> = {
  admin: ['view_apps', 'launch_app', 'admin_add_app', 'admin_manage_apps', 'admin_manage_groups'],
  'production.manager': ['view_apps', 'launch_app'],
  'production.operator': ['view_apps', 'launch_app'],
  'logistics.manager': ['view_apps', 'launch_app'],
  'logistics.operator': ['view_apps', 'launch_app'],
  'quality.manager': ['view_apps', 'launch_app'],
}

export function authorize(user: AuthUser, action: Action, _resource?: string): boolean {
  if (user.isAdmin) return true
  return user.roles.some((role) => roleActions[role]?.includes(action))
}

export function auditDenial(
  user: AuthUser | undefined,
  action: Action,
  resource: string | undefined,
  ip: string,
  path: string,
): void {
  logger.warn(
    {
      audit: true,
      action,
      resource,
      user: user?.email ?? 'anonymous',
      ip,
      path,
      result: 'denied',
    },
    'Accès refusé',
  )
}
