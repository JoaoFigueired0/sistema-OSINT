import { useState } from 'react'
import {
  Mail,
  XCircle,
  CheckCircle2,
  Server,
  Globe,
  AlertTriangle,
  Shield,
} from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CopyButton from '../components/UI/CopyButton'
import Badge, { BooleanBadge } from '../components/UI/Badge'
import { buscarEmail } from '../api/osint'
import type { EmailResponse } from '../types'

export default function EmailPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EmailResponse | null>(null)

  const handleSearch = async () => {
    const email = query.trim()
    if (!email) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await buscarEmail(email)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar e-mail')
    } finally {
      setLoading(false)
    }
  }

  const isValid = result?.Valido === true || result?.Valido === 'true' || result?.Valido === 'Sim'
  const isBlocked = result?.Bloqueado === true || result?.Bloqueado === 'true' || result?.Bloqueado === 'Sim'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-cyan" />
          <span className="section-title mb-0">Validação de E-mail</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Análise de{' '}
          <span className="text-cyan text-glow-cyan">E-mail</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Verificação completa de endereços de e-mail: validade, servidor, reputação e dados técnicos.
        </p>
      </div>

      {/* Search */}
      <div className="cyber-card mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="usuario@dominio.com"
          loading={loading}
          label="Endereço de e-mail para analisar"
          type="email"
          hint="Digite o endereço de e-mail completo incluindo o domínio."
        />
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Analisando endereço de e-mail..." />}

      {/* Error */}
      {error && !loading && (
        <div className="alert-error mb-6 animate-slide-up">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro na validação</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-slide-up">
          {/* Status overview */}
          <div className="cyber-card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${isValid ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
                  {isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger" />
                  )}
                </div>
                <div>
                  <div className="text-xs text-text-muted font-mono">Endereço analisado</div>
                  <div className="font-mono font-bold text-cyan text-base">{query}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <BooleanBadge value={result.Valido} trueLabel="E-mail válido" falseLabel="E-mail inválido" />
                {isBlocked && (
                  <Badge variant="danger" icon>Bloqueado</Badge>
                )}
              </div>
            </div>

            {/* Quick status row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Válido', value: result.Valido },
                { label: 'Bloqueado', value: result.Bloqueado },
                { label: 'Disponível', value: result.Disponivel },
                { label: 'Encaminhador', value: result.Encaminhador },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-bg-primary border border-border">
                  <span className="text-xs text-text-muted">{label}</span>
                  <BooleanBadge value={value} />
                </div>
              ))}
            </div>
          </div>

          {/* Typo suggestion */}
          {result['Erro de digitação'] && (
            <div className="alert-warning animate-slide-up">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Possível erro de digitação detectado</p>
                <p className="text-sm mt-1 opacity-80">
                  Você quis dizer: <span className="font-mono font-bold">{result['Erro de digitação']}</span>?
                </p>
              </div>
            </div>
          )}

          {/* Domain info */}
          <div className="cyber-card">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-cyan" />
              <h3 className="section-title mb-0">Informações do Domínio</h3>
            </div>

            <div className="divide-y divide-border">
              {[
                { label: 'Domínio', value: result['Dominio Email'], mono: true },
                { label: 'Tipo', value: result.Tipo },
                { label: 'Classificação', value: result.Classificação },
              ].map(({ label, value, mono }) => {
                if (!value) return null
                return (
                  <div key={label} className="data-row">
                    <span className="data-label">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`data-value ${mono ? 'text-cyan' : ''}`}>{value}</span>
                      <CopyButton text={value} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Server info */}
          <div className="cyber-card">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-cyan" />
              <h3 className="section-title mb-0">Servidor e Rede</h3>
            </div>

            <div className="divide-y divide-border">
              {[
                { label: 'Host', value: result.Host, mono: true },
                { label: 'Servidor de e-mail', value: result['Servidor de e-mail'], mono: true },
                { label: 'Endereço IP', value: result['Endereço IP'], mono: true },
              ].map(({ label, value, mono }) => {
                if (!value) return null
                return (
                  <div key={label} className="data-row">
                    <span className="data-label">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`data-value ${mono ? 'text-success' : ''}`}>{value}</span>
                      <CopyButton text={value} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security summary */}
          <div className="p-4 rounded-lg bg-bg-secondary border border-border flex items-start gap-3">
            <Shield className="w-4 h-4 text-cyan mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-mono text-text-secondary">
                <span className="text-cyan font-semibold">Resumo de segurança:</span>{' '}
                E-mail{' '}
                <span className={isValid ? 'text-success' : 'text-danger'}>
                  {isValid ? 'válido' : 'inválido'}
                </span>
                {isBlocked && <span className="text-danger">, bloqueado</span>}
                {result.Tipo && ` — Tipo: ${result.Tipo}`}
                {result.Classificação && ` — ${result.Classificação}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
