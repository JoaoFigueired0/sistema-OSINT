import { useState } from 'react'
import {
  Building2,
  XCircle,
  MapPin,
  Users,
  Calendar,
  FileText,
  Hash,
  AlertTriangle,
} from 'lucide-react'
import SearchInput from '../components/UI/SearchInput'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CopyButton from '../components/UI/CopyButton'
import Badge from '../components/UI/Badge'
import { buscarCnpj } from '../api/osint'
import { DataDisplay } from './SocialPage'

// Field group mapping for CNPJ response
const CNPJ_GROUPS: Array<{
  label: string
  icon: React.ReactNode
  keys: string[]
}> = [
  {
    label: 'Identificação',
    icon: <FileText className="w-4 h-4 text-cyan" />,
    keys: [
      'cnpj', 'razao_social', 'nome_fantasia', 'tipo', 'porte', 'natureza_juridica',
      'descricao_situacao_cadastral', 'situacao_cadastral', 'motivo_situacao_cadastral',
    ],
  },
  {
    label: 'Datas',
    icon: <Calendar className="w-4 h-4 text-cyan" />,
    keys: [
      'data_abertura', 'data_situacao_cadastral', 'data_inicio_atividade',
      'data_situacao_especial', 'data_opcao_pelo_simples', 'data_exclusao_do_simples',
    ],
  },
  {
    label: 'Endereço',
    icon: <MapPin className="w-4 h-4 text-cyan" />,
    keys: [
      'logradouro', 'numero', 'complemento', 'bairro', 'municipio', 'uf', 'cep',
      'ddd_telefone_1', 'ddd_telefone_2', 'email',
      'descricao_tipo_de_logradouro',
    ],
  },
  {
    label: 'Atividades',
    icon: <Hash className="w-4 h-4 text-cyan" />,
    keys: [
      'cnae_fiscal', 'cnae_fiscal_descricao', 'descricao_identificador_matriz_filial',
      'capital_social', 'opcao_pelo_simples', 'opcao_pelo_mei',
    ],
  },
]

function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return cnpj
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function validateCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  return digits.length === 14
}

export default function CnpjPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)

  const handleSearch = async () => {
    const cnpj = query.trim().replace(/\D/g, '')
    if (!cnpj) return

    if (!validateCnpj(cnpj)) {
      setInputError('CNPJ inválido. Digite os 14 dígitos.')
      return
    }

    setInputError(null)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await buscarCnpj(cnpj)
      setResult(data as Record<string, unknown>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ')
    } finally {
      setLoading(false)
    }
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setInputError(null)
  }

  const getGroupedFields = (data: Record<string, unknown>) => {
    const usedKeys = new Set<string>()
    const groups: Array<{ label: string; icon: React.ReactNode; fields: Record<string, unknown> }> = []

    for (const group of CNPJ_GROUPS) {
      const fields: Record<string, unknown> = {}
      for (const key of group.keys) {
        const matchingKey = Object.keys(data).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        )
        if (matchingKey && data[matchingKey] !== null && data[matchingKey] !== undefined && data[matchingKey] !== '') {
          fields[matchingKey] = data[matchingKey]
          usedKeys.add(matchingKey)
        }
      }
      if (Object.keys(fields).length > 0) {
        groups.push({ label: group.label, icon: group.icon, fields })
      }
    }

    const remaining: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (!usedKeys.has(key) && !Array.isArray(value)) {
        remaining[key] = value
      }
    }

    // Arrays (like qsa - quadro societário)
    const arrays: Record<string, unknown[]> = {}
    for (const [key, value] of Object.entries(data)) {
      if (!usedKeys.has(key) && Array.isArray(value) && value.length > 0) {
        arrays[key] = value as unknown[]
      }
    }

    return { groups, remaining, arrays }
  }

  const companyName =
    (result?.razao_social as string) ||
    (result?.nome as string) ||
    null

  const situation = (result?.descricao_situacao_cadastral as string) || (result?.situacao_cadastral as string) || null
  const isActive = situation?.toLowerCase().includes('ativa') || situation === '2'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-cyan" />
          <span className="section-title mb-0">Consulta CNPJ</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Dados{' '}
          <span className="text-cyan text-glow-cyan">Empresariais</span>
        </h1>
        <p className="text-text-secondary text-sm">
          Consulte informações completas de empresas brasileiras pelo CNPJ.
        </p>
      </div>

      {/* Search */}
      <div className="cyber-card mb-6">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          onSearch={handleSearch}
          placeholder="00.000.000/0000-00"
          loading={loading}
          label="CNPJ da empresa"
          hint="Digite apenas os números ou com pontuação. Ex: 00000000000000 ou 00.000.000/0000-00"
        />
        {inputError && (
          <div className="mt-2 flex items-center gap-2 text-danger text-xs font-mono">
            <AlertTriangle className="w-3 h-3" />
            {inputError}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Consultando dados do CNPJ..." />}

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
          {/* Company header */}
          <div className="cyber-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20 mt-0.5">
                  <Building2 className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <div className="text-xs text-text-muted font-mono">CNPJ</div>
                  <div className="font-mono font-bold text-cyan text-sm">
                    {formatCnpj(query.replace(/\D/g, ''))}
                  </div>
                  {companyName && (
                    <div className="font-bold text-text-primary text-lg mt-1">{companyName}</div>
                  )}
                  {result.nome_fantasia != null && String(result.nome_fantasia) !== companyName && (
                    <div className="text-text-secondary text-sm mt-0.5">
                      {String(result.nome_fantasia)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {situation && (
                  <Badge variant={isActive ? 'success' : 'danger'} dot>
                    {situation}
                  </Badge>
                )}
                {result.porte != null && (
                  <Badge variant="cyan">
                    {String(result.porte)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Grouped data */}
          {(() => {
            const { groups, remaining, arrays } = getGroupedFields(result)
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
                        const isMonoField = ['cnpj', 'cep', 'cnae_fiscal', 'capital_social', 'ddd_telefone_1', 'ddd_telefone_2', 'email'].includes(key)
                        return (
                          <div key={key} className="data-row">
                            <span className="data-label capitalize">{key.replace(/_/g, ' ')}</span>
                            <div className="flex items-center gap-2">
                              <span className={`data-value ${isMonoField ? 'text-cyan' : ''}`}>
                                {displayValue}
                              </span>
                              {displayValue && <CopyButton text={displayValue} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* QSA - Quadro Societário */}
                {Object.entries(arrays).map(([key, items]) => (
                  <div key={key} className="cyber-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-cyan" />
                      <h3 className="section-title mb-0 capitalize">{key.replace(/_/g, ' ')}</h3>
                      <Badge variant="cyan">{items.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-bg-primary border border-border">
                          <DataDisplay data={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Remaining fields */}
                {Object.keys(remaining).length > 0 && (
                  <div className="cyber-card">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-text-muted" />
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
