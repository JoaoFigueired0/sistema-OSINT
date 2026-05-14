import { useState } from 'react'
import { Globe, XCircle, Server, Calendar, User, Link } from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CopyButton from '../components/UI/CopyButton'
import Badge from '../components/UI/Badge'
import { buscarDominio } from '../api/osint'
import { DataDisplay } from './SocialPage'

// Known WHOIS field groups for better display
const FIELD_GROUPS: Record<string, { label: string; icon: React.ReactNode; keys: string[] }> = {
  registration: {
    label: 'Registro',
    icon: <Calendar className="w-4 h-4 text-cyan" />,
    keys: ['created', 'creation_date', 'updated_date', 'expiration_date', 'expires', 'updated', 'registrar_registration_expiration_date'],
  },
  registrant: {
    label: 'Registrante',
    icon: <User className="w-4 h-4 text-cyan" />,
    keys: ['registrant_name', 'registrant_organization', 'registrant_email', 'registrant_country', 'registrant_city', 'registrant_state', 'name', 'org'],
  },
  technical: {
    label: 'Técnico',
    icon: <Server className="w-4 h-4 text-cyan" />,
    keys: ['name_servers', 'nameservers', 'status', 'dnssec', 'registrar', 'registrar_whois_server', 'registrar_url'],
  },
}

export default function DomainPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const handleSearch = async () => {
    let domain = query.trim()
    if (!domain) return

    // Remove protocol if user typed it
    domain = domain.replace(/^https?:\/\//i, '').replace(/\/$/, '')

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await buscarDominio(domain)
      setResult(data as Record<string, unknown>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar domínio')
    } finally {
      setLoading(false)
    }
  }

  const getGroupedFields = (data: Record<string, unknown>) => {
    const usedKeys = new Set<string>()
    const groups: Array<{ label: string; icon: React.ReactNode; fields: Record<string, unknown> }> = []

    for (const [, group] of Object.entries(FIELD_GROUPS)) {
      const fields: Record<string, unknown> = {}
      for (const key of group.keys) {
        // Case-insensitive key matching
        const matchingKey = Object.keys(data).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        )
        if (matchingKey && data[matchingKey] !== null && data[matchingKey] !== undefined) {
          fields[matchingKey] = data[matchingKey]
          usedKeys.add(matchingKey)
        }
      }
      if (Object.keys(fields).length > 0) {
        groups.push({ label: group.label, icon: group.icon, fields })
      }
    }

    // Remaining fields not in any group
    const remaining: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (!usedKeys.has(key)) {
        remaining[key] = value
      }
    }

    return { groups, remaining }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-cyan" />
          <span className="section-title mb-0">Domínio / WHOIS</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Consulta de{' '}
          <span className="text-cyan text-glow-cyan">Domínio</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Obtenha informações completas sobre um domínio: proprietário, registrador, servidores DNS, datas e mais.
        </p>
      </div>

      {/* Search */}
      <div className="cyber-card mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="exemplo.com.br"
          loading={loading}
          label="Domínio para consultar"
          hint="Digite o domínio sem http:// ou www. Ex: google.com, meusite.com.br"
        />
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Consultando WHOIS do domínio..." />}

      {/* Error */}
      {error && !loading && (
        <div className="alert-error mb-6 animate-slide-up">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro na consulta</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-slide-up">
          {/* Header card */}
          <div className="cyber-card">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
                  <Link className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <div className="text-xs text-text-muted font-mono">Domínio consultado</div>
                  <div className="font-mono font-bold text-cyan text-base">{query}</div>
                </div>
              </div>
              <Badge variant="success" icon>Dados encontrados</Badge>
            </div>
          </div>

          {/* Grouped fields */}
          {(() => {
            const { groups, remaining } = getGroupedFields(result)
            return (
              <>
                {groups.map(({ label, icon, fields }) => (
                  <div key={label} className="cyber-card">
                    <div className="flex items-center gap-2 mb-4">
                      {icon}
                      <h3 className="section-title mb-0">{label}</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {Object.entries(fields).map(([key, value]) => {
                        const displayValue = Array.isArray(value)
                          ? value.join(', ')
                          : String(value ?? '')
                        return (
                          <div key={key} className="data-row">
                            <span className="data-label capitalize">{key.replace(/_/g, ' ')}</span>
                            <div className="flex items-center gap-2">
                              <span className="data-value text-cyan font-mono text-xs">{displayValue}</span>
                              {displayValue && <CopyButton text={displayValue} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Remaining/raw data */}
                {Object.keys(remaining).length > 0 && (
                  <div className="cyber-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Server className="w-4 h-4 text-text-muted" />
                      <h3 className="section-title mb-0">Dados Adicionais</h3>
                    </div>
                    <DataDisplay data={remaining} />
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
