import { useEffect, useState } from 'react'
import { Server, Search, Download, Container, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api, type DiscoveredContainer } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DockerDiscovery() {
  const [host, setHost] = useState('')
  const [containers, setContainers] = useState<DiscoveredContainer[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [importingId, setImportingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [importForm, setImportForm] = useState<
    Record<
      string,
      {
        id: string
        name: string
        description: string
        category: string
        icon: string
        roles: string
        accessType: 'redirect' | 'docker'
        redirectUrl: string
        sso: boolean
      }
    >
  >({})

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {})
  }, [])

  async function handleScan() {
    try {
      setScanning(true)
      const result = await api.discovery.scan(host || undefined)
      setContainers(result)
      setScanned(true)
      if (result.length === 0) {
        toast.info('Aucun conteneur trouvé sur cet hôte')
      } else {
        toast.success(`${result.length} conteneur(s) trouvé(s)`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Impossible de scanner cet hôte')
    } finally {
      setScanning(false)
    }
  }

  function startImport(c: DiscoveredContainer) {
    const id = slugify(c.name)
    const name = c.name.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    const description =
      c.labels['isb.description'] ?? c.labels['description'] ?? `Application ${name}`
    const category = c.labels['isb.category'] ?? c.labels['category'] ?? ''
    const isRunning = c.status === 'running'
    const hostPort = c.ports.find((p) => p.hostPort)?.hostPort
    const redirectUrl = hostPort ? `http://localhost:${hostPort}` : ''

    setImportForm((prev) => ({
      ...prev,
      [c.id]: {
        id,
        name,
        description,
        category: categories.includes(category) ? category : '',
        icon: 'Container',
        roles: c.labels['isb.roles'] ?? '',
        accessType: isRunning ? 'redirect' : 'docker',
        redirectUrl,
        sso: false,
      },
    }))
    setImportingId(c.id)
  }

  function cancelImport(id: string) {
    setImportingId((prev) => (prev === id ? null : prev))
  }

  function updateFormField(containerId: string, field: string, value: string) {
    setImportForm((prev) => ({
      ...prev,
      [containerId]: { ...prev[containerId], [field]: value },
    }))
  }

  async function handleImport(c: DiscoveredContainer) {
    const form = importForm[c.id]
    if (!form?.id || !form?.name) {
      toast.error("Le nom et l'identifiant sont requis")
      return
    }

    try {
      const roles = form.roles
        ? form.roles
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)
        : []

      await api.discovery.import({
        host: host || undefined,
        containerId: c.id,
        accessType: form.accessType,
        redirectUrl: form.accessType === 'redirect' ? form.redirectUrl : undefined,
        manifest: {
          id: form.id,
          name: form.name,
          description: form.description,
          category: form.category,
          icon: form.icon,
          roles,
          sso: form.accessType === 'redirect' ? form.sso : false,
        },
      })

      toast.success(`"${form.name}" importée avec succès`)
      setImportingId((prev) => (prev === c.id ? null : prev))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'import")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 rounded-2xl border">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[13px] font-medium text-isb-muted mb-1.5">
              Hôte Docker
            </label>
            <Input
              placeholder="unix:///var/run/docker.sock"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </div>
          <Button onClick={handleScan} disabled={scanning} className="shrink-0">
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Scanner
          </Button>
        </div>
        <p className="text-[12px] text-isb-muted mt-2">
          Laissez vide pour le socket local, ou utilisez{' '}
          <code className="text-isb-brown bg-muted px-1 rounded">tcp://&lt;ip&gt;:2375</code> pour
          un hôte distant.
        </p>
      </Card>

      {scanning && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-isb-muted" />
          <span className="ml-3 text-isb-muted">Scan en cours...</span>
        </div>
      )}

      {!scanning && scanned && containers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Server size={40} className="text-isb-muted" />
          <p className="text-[16px] font-semibold text-isb-brown">Aucun conteneur trouvé</p>
          <p className="text-[14px] text-isb-muted">
            Vérifiez que l&apos;hôte est accessible et que Docker est en cours d&apos;exécution.
          </p>
        </div>
      )}

      {!scanning && containers.length > 0 && (
        <div className="bg-card rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conteneur</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((c) => (
                <>
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Container size={14} className="text-isb-muted shrink-0" />
                        <div>
                          <div className="text-[14px] font-medium text-isb-brown">{c.name}</div>
                          <div className="text-[11px] font-mono text-isb-muted">
                            {c.id.slice(0, 12)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] font-mono text-isb-brown">{c.image}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={c.status === 'running' ? 'default' : 'secondary'}
                        className={
                          c.status === 'running'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : ''
                        }
                      >
                        {c.status === 'running'
                          ? 'En cours'
                          : c.status === 'exited'
                            ? 'Arrêté'
                            : c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.ports.length > 0 ? (
                          c.ports.slice(0, 3).map((p, i) => (
                            <Badge key={i} variant="outline" className="text-[11px] font-mono">
                              {p.hostPort ? `${p.hostPort}:${p.containerPort}` : p.containerPort}/
                              {p.protocol}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[12px] text-isb-muted">—</span>
                        )}
                        {c.ports.length > 3 && (
                          <Badge variant="outline" className="text-[11px]">
                            +{c.ports.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] text-isb-muted">
                      {formatDate(c.created)}
                    </TableCell>
                    <TableCell className="text-right">
                      {importingId === c.id ? (
                        <Button variant="ghost" size="sm" onClick={() => cancelImport(c.id)}>
                          <X size={14} />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => startImport(c)}>
                          <Download size={14} />
                          Importer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {importingId === c.id && importForm[c.id] && (
                    <TableRow key={`${c.id}-form`}>
                      <TableCell colSpan={6} className="bg-muted/30 p-4">
                        <div className="max-w-2xl mx-auto space-y-4">
                          <h4 className="text-[14px] font-semibold text-isb-brown flex items-center gap-2">
                            <Download size={14} />
                            Importer dans le registre
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Identifiant
                              </label>
                              <Input
                                value={importForm[c.id].id}
                                onChange={(e) => updateFormField(c.id, 'id', e.target.value)}
                                placeholder="mon-app"
                              />
                            </div>
                            <div>
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Nom
                              </label>
                              <Input
                                value={importForm[c.id].name}
                                onChange={(e) => updateFormField(c.id, 'name', e.target.value)}
                                placeholder="Mon App"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Description
                              </label>
                              <Input
                                value={importForm[c.id].description}
                                onChange={(e) =>
                                  updateFormField(c.id, 'description', e.target.value)
                                }
                                placeholder="Description de l'application"
                              />
                            </div>
                            <div>
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                 Type d&apos;accès
                              </label>
                              <Select
                                value={importForm[c.id].accessType}
                                onValueChange={(v) => updateFormField(c.id, 'accessType', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="redirect">Redirection (déjà en cours)</SelectItem>
                                  <SelectItem value="docker">Docker (démarrage à la demande)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Catégorie
                              </label>
                              <Select
                                value={importForm[c.id].category}
                                onValueChange={(v) => updateFormField(c.id, 'category', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {importForm[c.id].accessType === 'redirect' && (
                              <div className="col-span-2">
                                <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                  URL d&apos;accès
                                </label>
                                <Input
                                  value={importForm[c.id].redirectUrl}
                                  onChange={(e) => updateFormField(c.id, 'redirectUrl', e.target.value)}
                                  placeholder="http://localhost:3000"
                                />
                              </div>
                            )}
                            {importForm[c.id].accessType === 'redirect' && (
                              <div className="col-span-2 flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'hsl(var(--border))' }}>
                                <div>
                                  <p className="text-[12px] font-medium text-isb-muted">SSO</p>
                                  <p className="text-[11px] text-isb-muted">Transmettre l&apos;identité de l&apos;utilisateur à l&apos;application</p>
                                </div>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={importForm[c.id].sso}
                                  onClick={() => updateFormField(c.id, 'sso', String(!importForm[c.id].sso))}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${importForm[c.id].sso ? 'bg-primary' : 'bg-muted'}`}
                                >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${importForm[c.id].sso ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                              </div>
                            )}
                            <div>
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Icône (Lucide)
                              </label>
                              <Input
                                value={importForm[c.id].icon}
                                onChange={(e) => updateFormField(c.id, 'icon', e.target.value)}
                                placeholder="Container"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[12px] font-medium text-isb-muted mb-1">
                                Rôles (séparés par des virgules)
                              </label>
                              <Input
                                value={importForm[c.id].roles}
                                onChange={(e) => updateFormField(c.id, 'roles', e.target.value)}
                                placeholder="admin, quality.manager"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <Button size="sm" onClick={() => handleImport(c)}>
                              <Check size={14} />
                              Confirmer l&apos;import
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => cancelImport(c.id)}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
