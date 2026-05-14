import { useState } from 'react'
import { Gamepad2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import Badge from '../components/UI/Badge'
import { buscarGameGeral, buscarRoblox, buscarHytale, buscarMinecraft } from '../api/osint'
import type { GameGeralResponse, GamePlatformResult } from '../types'
import { DataDisplay } from './SocialPage'

type GameMode = 'geral' | 'roblox' | 'hytale' | 'minecraft'

const GAME_LABELS: Record<string, string> = {
  roblox: 'Roblox',
  hytale: 'Hytale',
  minecraft: 'Minecraft',
}

const GAME_COLORS: Record<string, string> = {
  roblox: '#00b2ff',
  hytale: '#ffd700',
  minecraft: '#5b8731',
}

const tabs: { id: GameMode; label: string }[] = [
  { id: 'geral', label: 'Todos os Jogos' },
  { id: 'roblox', label: 'Roblox' },
  { id: 'minecraft', label: 'Minecraft' },
  { id: 'hytale', label: 'Hytale' },
]

export default function GamesPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<GameMode>('geral')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geralResult, setGeralResult] = useState<GameGeralResponse | null>(null)
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
        const data = await buscarGameGeral(username)
        setGeralResult(data)
      } else {
        let data: unknown
        switch (activeTab) {
          case 'roblox': data = await buscarRoblox(username); break
          case 'hytale': data = await buscarHytale(username); break
          case 'minecraft': data = await buscarMinecraft(username); break
          default: data = {}
        }
        setSingleResult(data as Record<string, unknown>)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados do jogo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="w-4 h-4 text-cyan" />
          <span className="section-title mb-0">Jogos Online</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Investigação em{' '}
          <span className="text-cyan text-glow-cyan">Jogos Online</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Busque perfis de jogadores em plataformas de jogos online.
        </p>
      </div>

      {/* Game tabs */}
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
              px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-cyan/15 text-cyan border border-cyan/30'
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
          placeholder="jogador123"
          loading={loading}
          label={`Username para buscar em ${activeTab === 'geral' ? 'todos os jogos' : GAME_LABELS[activeTab]}`}
          hint={
            activeTab === 'minecraft'
              ? 'Busca pelo nickname exato do jogador'
              : activeTab === 'roblox'
              ? 'Busca por username ou ID do Roblox'
              : undefined
          }
        />
      </div>

      {/* Loading */}
      {loading && (
        <LoadingSpinner
          message={`Buscando em ${activeTab === 'geral' ? 'todos os jogos' : GAME_LABELS[activeTab]}...`}
        />
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
            <span className="section-title mb-0">Resultados para:</span>
            <span className="font-mono text-cyan font-bold">@{query}</span>
          </div>

          {Object.entries(geralResult).map(([game, gameData]) => {
            const gd = gameData as GamePlatformResult | undefined
            if (!gd) return null
            const found = gd.success === true
            const label = GAME_LABELS[game] || game
            const color = GAME_COLORS[game] || '#666'

            return (
              <GameCard
                key={game}
                game={label}
                color={color}
                found={found}
                data={gd.data}
                error={gd.error}
              />
            )
          })}
        </div>
      )}

      {/* Single game result */}
      {singleResult && !loading && (
        <div className="animate-slide-up cyber-card">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: GAME_COLORS[activeTab] || '#666' }}
            />
            <h3 className="font-bold text-text-primary">{GAME_LABELS[activeTab]}</h3>
            <Badge variant="success" icon>Encontrado</Badge>
          </div>
          <DataDisplay data={singleResult} />
        </div>
      )}
    </div>
  )
}

interface GameCardProps {
  game: string
  color: string
  found: boolean
  data?: unknown
  error?: string
}

function GameCard({ game, color, found, data, error }: GameCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`cyber-card border ${found ? 'border-success/20' : 'border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="font-semibold text-sm text-text-primary">{game}</span>
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
