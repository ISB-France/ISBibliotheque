import { z } from 'zod'

const redirectAccessSchema = z.object({
  type: z.literal('redirect'),
  url: z.string().url(),
})

const dockerAccessSchema = z.object({
  type: z.literal('docker'),
  composeFile: z.string().min(1),
  serviceName: z.string().min(1),
  internalPort: z.number().int().min(1).max(65535),
  healthUrl: z.string().url().optional(),
})

export const appManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id must be lowercase alphanumeric with dashes'),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum([
    'Gestion',
    'Production',
    'RH',
    'Finance',
    'Qualité',
    'Logistique',
    'Commercial',
    'IT',
  ]),
  icon: z.string().min(1),
  access: z.discriminatedUnion('type', [redirectAccessSchema, dockerAccessSchema]),
  roles: z.array(z.string()).optional().default([]),
})

export const appManifestUpdateSchema = appManifestSchema.partial().required({ id: true })

export type AppManifestInput = z.infer<typeof appManifestSchema>
