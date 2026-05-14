import { useState } from 'react'
import {
  Users,
  XCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CopyButton from '../components/UI/CopyButton'
import Badge from '../components/UI/Badge'
import {
  buscarSocialGeral,
  buscarTwitter,
  buscarInstagram,
  buscarTwitch,
  buscarTikTok,
  buscarThreads,
  buscarSnapchat,
  buscarFacebook,
} from '../api/osint'
import type {
  SocialGeralResponse,
  SocialPlatformResult,
  TwitterResponse,
  InstagramResponse,
} from '../types'

type Mode = 'geral' | 'twitter' | 'instagram' | 'twitch' | 'tiktok' | 'threads' | 'snapchat' | 'facebook'

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  threads: 'Threads',
  tiktok: 'TikTok',
  twitter: 'Twitter / X',
  snapchat: 'Snapchat',
  twitch: 'Twitch',
  facebook: 'Facebook',
  xbox: 'Xbox',
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e1306c',
  threads: '#000000',
  tiktok: '#ff0050',
  twitter: '#1d9bf0',
  snapchat: '#fffc00',
  twitch: '#9146ff',
  facebook: '#1877f2',
  xbox: '#107c10',
}

const tabs: { id: Mode; label: string }[] = [
  { id: 'geral', label: 'Varredura Geral' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitch', label: 'Twitch' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'threads', label: 'Threads' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'facebook', label: 'Facebook' },
]

export default function SocialPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<Mode>('geral')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geralResult, setGeralResult] = useState<SocialGeralResponse | null>(null)
  const [singleResult, setSingleResult] = useState<Record<string, unknown> | null>(null)

  const handleSearch = async () => {
    const username = query.trim()
    if (!username) return

    setLoading(true)
    setError(null)
    setGeralResult(null)
    setSingleResult(null)

    try {
      if (activeTab === 'geral') {
        const data = await buscarSocialGeral(username)
        setGeralResult(data)
      } else {
        let data: unknown
        switch (activeTab) {
          case 'twitter': data = await buscarTwitter(username); break
          case 'instagram': data = await buscarInstagram(username); break
          case 'twitch': data = await buscarTwitch(username); break
          case 'tiktok': data = await buscarTikTok(username); break
          case 'threads': data = await buscarThreads(username); break
          case 'snapchat': data = await buscarSnapchat(username); break
          case 'facebook': data = await buscarFacebook(username); break
          default: data = {}
        }
        setSingleResult(data as Record<string, unknown>)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados sociais')
    } finally {
      setLoading(false)
    }
  }

  const placeholders: Record<Mode, string> = {
    geral: 'usuario123',
    twitter: '@usuario ou usuario',
    instagram: 'usuario123',
    twitch: 'streamer123',
    tiktok: '@usuario ou usuario',
    threads: 'usuario123',
    snapchat: 'usuario123',
    facebook: 'usuario123',
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-purple" />
          <span className="section-title mb-0" style={{ color: '#8b5cf6' }}>Redes Sociais</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Investigação em{' '}
          <span style={{ color: '#8b5cf6', textShadow: '0 0 10px rgba(139,92,246,0.4)' }}>
            Redes Sociais
          </span>
        </h1>
        <p className="text-text-secondary text-sm">
          Busque perfis em múltiplas plataformas ao mesmo tempo ou individualmente.
        </p>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5 p-1 bg-bg-secondary rounded-xl border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setGeralResult(null)
              setSingleResult(null)
              setError(null)
            }}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium font-mono transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-purple/15 text-purple border border-purple/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-tertiary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="cyber-card mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder={placeholders[activeTab]}
          loading={loading}
          label={`Username para ${activeTab === 'geral' ? 'varredura geral' : PLATFORM_LABELS[activeTab] || activeTab}`}
        />
      </div>

      {/* Loading */}
      {loading && (
        <LoadingSpinner message={`Buscando no${activeTab === 'geral' ? 's' : ''} ${activeTab === 'geral' ? 'redes sociais' : PLATFORM_LABELS[activeTab]}...`} />
      )}

      {/* Error */}
      {error && !loading && (
        <div className="alert-error mb-6 animate-slide-up">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro na busca</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Geral Results */}
      {geralResult && !loading && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="section-title mb-0" style={{ color: '#8b5cf6' }}>Resultados para:</span>
            <span className="font-mono text-purple font-bold">@{query}</span>
          </div>

          {Object.entries(geralResult).map(([platform, platformData]) => {
            const pd = platformData as SocialPlatformResult | undefined
            if (!pd) return null
            const found = pd.success === true
            const label = PLATFORM_LABELS[platform] || platform
            const color = PLATFORM_COLORS[platform] || '#666'

            return (
              <PlatformCard
                key={platform}
                platform={label}
                color={color}
                found={found}
                data={pd.data}
                error={pd.error}
                status={pd.status}
              />
            )
          })}
        </div>
      )}

      {/* Single platform result */}
      {singleResult && !loading && (
        <div className="animate-slide-up">
          {activeTab === 'twitter' ? (
            <TwitterCard data={singleResult as unknown as TwitterResponse} />
          ) : activeTab === 'instagram' ? (
            <InstagramCard data={singleResult as unknown as InstagramResponse} />
          ) : (
            <GenericDataCard data={singleResult} title={PLATFORM_LABELS[activeTab] || activeTab} />
          )}
        </div>
      )}
    </div>
  )
}

// Platform card for geral mode
interface PlatformCardProps {
  platform: string
  color: string
  found: boolean
  data?: unknown
  error?: string
  status?: string | number
}

function PlatformCard({ platform, color, found, data, error, status }: PlatformCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`cyber-card border ${found ? 'border-success/20' : 'border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold text-sm text-text-primary">{platform}</span>
          {status && (
            <span className="text-xs font-mono text-text-muted">
              status: {status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {found ? (
            <Badge variant="success" icon>Encontrado</Badge>
          ) : (
            <Badge variant="muted" dot>Não encontrado</Badge>
          )}
          {found && data != null && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded text-text-muted hover:text-cyan transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs font-mono text-danger">{error}</p>
      )}

      {found && data != null && expanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <DataDisplay data={data as Record<string, unknown>} />
        </div>
      )}
    </div>
  )
}

// Twitter specific card
function TwitterCard({ data }: { data: TwitterResponse }) {
  if (!data) return null

  const fields: { label: string; key: keyof TwitterResponse; mono?: boolean }[] = [
    { label: 'Username', key: 'username', mono: true },
    { label: 'Nome', key: 'nome' },
    { label: 'ID', key: 'id', mono: true },
    { label: 'Bio', key: 'bio' },
    { label: 'Tweets', key: 'tweets', mono: true },
    { label: 'Criado em', key: 'criado_em', mono: true },
    { label: 'Status', key: 'status' },
  ]

  return (
    <div className="cyber-card border-cyan/20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1d9bf0' }} />
          <h3 className="font-bold text-text-primary">Twitter / X</h3>
        </div>
        <div className="flex items-center gap-2">
          {data.verificado_blue && (
            <Badge variant="cyan" icon>Verificado</Badge>
          )}
          <Badge variant="success" icon>Encontrado</Badge>
        </div>
      </div>

      {data.banner && (
        <div className="mb-4 rounded-lg overflow-hidden border border-border h-24 bg-bg-primary">
          <img
            src={data.banner}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      <div className="space-y-0 divide-y divide-border">
        {fields.map(({ label, key, mono }) => {
          const value = data[key]
          if (value === undefined || value === null || value === '') return null
          return (
            <div key={key} className="data-row">
              <span className="data-label">{label}</span>
              <div className="flex items-center gap-2">
                <span className={`data-value ${mono ? 'text-cyan' : ''}`}>
                  {String(value)}
                </span>
                <CopyButton text={String(value)} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Instagram specific card
function InstagramCard({ data }: { data: InstagramResponse }) {
  if (!data) return null

  return (
    <div className="cyber-card border-purple/20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e1306c' }} />
          <h3 className="font-bold text-text-primary">Instagram</h3>
        </div>
        <Badge variant="success" icon>Encontrado</Badge>
      </div>

      {data['Foto Perfil'] && (
        <div className="mb-4 flex justify-center">
          <img
            src={data['Foto Perfil']}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full border-2 border-purple/30 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      <div className="space-y-0 divide-y divide-border">
        {[
          { label: 'Conta', value: data.Conta },
          { label: 'Nome', value: data.Nome },
          { label: 'ID', value: String(data.Id ?? '') },
          { label: 'Bio', value: data.Bio },
        ].map(({ label, value }) => {
          if (!value) return null
          return (
            <div key={label} className="data-row">
              <span className="data-label">{label}</span>
              <div className="flex items-center gap-2">
                <span className="data-value text-purple">{value}</span>
                <CopyButton text={value} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Generic card for other platforms
function GenericDataCard({ data, title }: { data: Record<string, unknown>; title: string }) {
  return (
    <div className="cyber-card">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="success" icon>Encontrado</Badge>
        <h3 className="font-bold text-text-primary">{title}</h3>
      </div>
      <DataDisplay data={data} />
    </div>
  )
}

// Recursive data display
function DataDisplay({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object') {
    return <span className="text-sm font-mono text-text-secondary">{String(data ?? '-')}</span>
  }

  const entries = Object.entries(data as Record<string, unknown>)

  return (
    <div className="space-y-0 divide-y divide-border">
      {entries.map(([key, value]) => {
        const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
        const isNested = value !== null && typeof value === 'object'

        return (
          <div key={key} className="data-row flex-col items-start gap-1">
            <span className="data-label text-cyan text-xs uppercase tracking-wider">{key}</span>
            {isNested ? (
              <div className="ml-4 w-full">
                <DataDisplay data={value} />
              </div>
            ) : isUrl ? (
              <div className="flex items-center gap-2 w-full justify-end">
                <span className="data-value text-xs truncate max-w-xs">{String(value)}</span>
                <CopyButton text={String(value)} />
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan hover:text-cyan-bright p-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-end">
                <span className="data-value">{value === null ? <span className="text-text-muted italic">null</span> : String(value)}</span>
                {value !== null && value !== undefined && (
                  <CopyButton text={String(value)} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { DataDisplay }
