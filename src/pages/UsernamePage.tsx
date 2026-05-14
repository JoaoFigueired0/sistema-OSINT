import { useState } from 'react'
import { Search, ExternalLink, CheckCircle2, XCircle, Eye, Layers } from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CopyButton from '../components/UI/CopyButton'
import Badge from '../components/UI/Badge'
import { buscarOsintUsername } from '../api/osint'
import type { OsintUsernameResponse, SherlockResult, MaigretResult } from '../types'

export default function UsernamePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OsintUsernameResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'sherlock' | 'maigret'>('all')
  const [filterFound, setFilterFound] = useState<'all' | 'found' | 'not-found'>('found')

  const handleSearch = async () => {
    const username = query.trim()
    if (!username) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await buscarOsintUsername(username)
      setResult(data)
      setActiveTab('all')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar username')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredSherlock = (items: SherlockResult[]) => {
    if (filterFound === 'found') return items.filter((i) => i.found)
    if (filterFound === 'not-found') return items.filter((i) => !i.found)
    return items
  }

  const getFilteredMaigret = (items: MaigretResult[]) => {
    if (filterFound === 'found') return items.filter((i) => i.found)
    if (filterFound === 'not-found') return items.filter((i) => !i.found)
    return items
  }

  const sherlockFound = result?.sherlock?.filter((i) => i.found).length ?? 0
  const maigretFound = result?.maigret?.filter((i) => i.found).length ?? 0
  const totalFound = sherlockFound + maigretFound

  const sherlockFiltered = result ? getFilteredSherlock(result.sherlock ?? []) : []
  const maigretFiltered = result ? getFilteredMaigret(result.maigret ?? []) : []

  const showSherlock = activeTab === 'all' || activeTab === 'sherlock'
  const showMaigret = activeTab === 'all' || activeTab === 'maigret'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-cyan" />
          <span className="section-title mb-0">Username / OSINT</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Rastreamento de{' '}
          <span className="text-cyan text-glow-cyan">Username</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Pesquisa em centenas de plataformas usando Sherlock e Maigret para encontrar perfis associados ao username.
        </p>
      </div>

      {/* Search */}
      <div className="cyber-card mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="usuario123"
          loading={loading}
          label="Username para investigar"
          hint="Digite o username sem @ ou #. A busca pode levar 30-120 segundos."
        />
      </div>

      {/* Loading */}
      {loading && (
        <LoadingSpinner message="Executando Sherlock + Maigret scan..." size="md" />
      )}

      {/* Error */}
      {error && !loading && (
        <div className="alert-error mb-6 animate-slide-up">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro na investigação</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="animate-slide-up space-y-5">
          {/* Summary */}
          <div className="cyber-card">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
                  <Eye className="w-4 h-4 text-cyan" />
                </div>
                <div>
                  <div className="text-xs text-text-muted font-mono">Target</div>
                  <div className="font-mono font-bold text-cyan text-lg">
                    @{result.username || query}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="text-center px-4 py-2 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-2xl font-bold font-mono text-success">{totalFound}</div>
                  <div className="text-xs text-text-muted">Perfis encontrados</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-bg-primary border border-border">
                  <div className="text-2xl font-bold font-mono text-cyan">{sherlockFound}</div>
                  <div className="text-xs text-text-muted">Sherlock</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-bg-primary border border-border">
                  <div className="text-2xl font-bold font-mono text-purple">{maigretFound}</div>
                  <div className="text-xs text-text-muted">Maigret</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'sherlock', 'maigret'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-1.5 rounded-lg text-sm font-medium font-mono transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-cyan/15 text-cyan border border-cyan/30'
                      : 'text-text-muted hover:text-text-secondary border border-transparent hover:border-border'
                    }
                  `}
                >
                  {tab === 'all' ? 'Todos' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'sherlock' && (
                    <span className="ml-1.5 text-xs opacity-70">({result.sherlock?.length ?? 0})</span>
                  )}
                  {tab === 'maigret' && (
                    <span className="ml-1.5 text-xs opacity-70">({result.maigret?.length ?? 0})</span>
                  )}
                </button>
              ))}

              <div className="ml-auto flex gap-2">
                {(['all', 'found', 'not-found'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterFound(f)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200
                      ${filterFound === f
                        ? f === 'found'
                          ? 'bg-success/15 text-success border border-success/30'
                          : f === 'not-found'
                          ? 'bg-danger/15 text-danger border border-danger/30'
                          : 'bg-bg-tertiary text-text-primary border border-border'
                        : 'text-text-muted border border-transparent hover:border-border'
                      }
                    `}
                  >
                    {f === 'all' ? 'Todos' : f === 'found' ? 'Encontrados' : 'Não encontrados'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sherlock results */}
          {showSherlock && (result.sherlock?.length ?? 0) > 0 && (
            <div className="cyber-card">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-cyan" />
                <h3 className="section-title mb-0">Sherlock</h3>
                <Badge variant="cyan">
                  {sherlockFound} / {result.sherlock?.length ?? 0}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {sherlockFiltered.map((item, idx) => (
                  <ResultItem key={idx} site={item.site} url={item.url} found={item.found} />
                ))}
              </div>

              {sherlockFiltered.length === 0 && (
                <p className="text-text-muted text-sm font-mono text-center py-4">
                  Nenhum resultado para o filtro selecionado.
                </p>
              )}
            </div>
          )}

          {/* Maigret results */}
          {showMaigret && (result.maigret?.length ?? 0) > 0 && (
            <div className="cyber-card">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-purple" />
                <h3 className="section-title mb-0" style={{ color: '#8b5cf6' }}>Maigret</h3>
                <Badge variant="purple">
                  {maigretFound} / {result.maigret?.length ?? 0}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {maigretFiltered.map((item, idx) => (
                  <ResultItem
                    key={idx}
                    site={item.site}
                    url={item.url}
                    found={item.found}
                    ids={item.ids}
                    accentColor="purple"
                  />
                ))}
              </div>

              {maigretFiltered.length === 0 && (
                <p className="text-text-muted text-sm font-mono text-center py-4">
                  Nenhum resultado para o filtro selecionado.
                </p>
              )}
            </div>
          )}

          {/* No results state */}
          {totalFound === 0 && (
            <div className="cyber-card text-center py-10">
              <XCircle className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="text-text-secondary font-semibold mb-1">Nenhum perfil encontrado</h3>
              <p className="text-text-muted text-sm font-mono">
                O username <span className="text-cyan">@{result.username || query}</span> não foi localizado em nenhuma plataforma.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Result item component
interface ResultItemProps {
  site: string
  url: string
  found: boolean
  ids?: Record<string, string>
  accentColor?: 'cyan' | 'purple'
}

function ResultItem({ site, url, found, ids, accentColor = 'cyan' }: ResultItemProps) {
  const accent = accentColor === 'cyan' ? 'text-cyan' : 'text-purple'
  const borderAccent = accentColor === 'cyan' ? 'border-cyan/30 bg-cyan/5' : 'border-purple/30 bg-purple/5'

  if (!found) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded bg-bg-primary border border-border opacity-40">
        <XCircle className="w-3 h-3 text-text-muted flex-shrink-0" />
        <span className="text-text-muted text-xs font-mono truncate">{site}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded border ${borderAccent}`}>
      <CheckCircle2 className={`w-3 h-3 ${accent} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-mono font-semibold ${accent} truncate`}>{site}</div>
        {ids && Object.keys(ids).length > 0 && (
          <div className="text-xs text-text-muted font-mono mt-0.5 truncate">
            {Object.entries(ids).map(([k, v]) => `${k}: ${v}`).join(' | ')}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <CopyButton text={url} size="sm" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-1 rounded ${accent} hover:bg-cyan/10 transition-colors`}
          title="Abrir link"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
