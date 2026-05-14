import { Link } from 'react-router-dom'
import {
  Search,
  Users,
  Gamepad2,
  Mail,
  Globe,
  Building2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react'

interface ToolCard {
  path: string
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  accentColor: 'cyan' | 'purple'
  badge?: string
}

const tools: ToolCard[] = [
  {
    path: '/username',
    icon: <Search className="w-6 h-6" />,
    title: 'Username / OSINT',
    description: 'Rastreamento completo de username em centenas de plataformas usando Sherlock e Maigret.',
    features: ['Sherlock scan', 'Maigret scan', 'Centenas de sites'],
    accentColor: 'cyan',
    badge: 'OSINT',
  },
  {
    path: '/social',
    icon: <Users className="w-6 h-6" />,
    title: 'Redes Sociais',
    description: 'Consulta de perfis em múltiplas redes sociais: Instagram, Twitter, TikTok, Twitch e mais.',
    features: ['Instagram', 'Twitter', 'TikTok', 'Twitch', 'Facebook'],
    accentColor: 'purple',
  },
  {
    path: '/games',
    icon: <Gamepad2 className="w-6 h-6" />,
    title: 'Jogos Online',
    description: 'Busca de perfis de jogadores em plataformas como Roblox, Minecraft e Hytale.',
    features: ['Roblox', 'Minecraft', 'Hytale'],
    accentColor: 'cyan',
  },
  {
    path: '/email',
    icon: <Mail className="w-6 h-6" />,
    title: 'Validação de E-mail',
    description: 'Análise completa de endereços de e-mail: validade, servidor, IP, classificação e mais.',
    features: ['Validação', 'Servidor MX', 'Endereço IP', 'Classificação'],
    accentColor: 'purple',
  },
  {
    path: '/domain',
    icon: <Globe className="w-6 h-6" />,
    title: 'Domínio / WHOIS',
    description: 'Consulta de informações de domínios: registro, proprietário, servidores DNS e histórico.',
    features: ['WHOIS', 'DNS', 'Registrador', 'Datas'],
    accentColor: 'cyan',
  },
  {
    path: '/cnpj',
    icon: <Building2 className="w-6 h-6" />,
    title: 'Consulta CNPJ',
    description: 'Dados completos de empresas brasileiras: razão social, endereço, sócios e situação fiscal.',
    features: ['Razão Social', 'Endereço', 'Sócios', 'Situação'],
    accentColor: 'purple',
  },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
            <Shield className="w-5 h-5 text-cyan" />
          </div>
          <span className="text-xs font-mono font-semibold tracking-widest uppercase text-cyan">
            Sistema Operacional
          </span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Central de{' '}
          <span className="text-cyan text-glow-cyan">Investigação</span>
        </h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed">
          Plataforma integrada de OSINT (Open Source Intelligence) para investigação digital.
          Selecione uma ferramenta abaixo para iniciar a análise.
        </p>

        {/* Stats bar */}
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { label: 'Ferramentas', value: '7', icon: <Zap className="w-3 h-3" /> },
            { label: 'Plataformas', value: '15+', icon: <Globe className="w-3 h-3" /> },
            { label: 'Sites OSINT', value: '500+', icon: <Search className="w-3 h-3" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-secondary border border-border"
            >
              <span className="text-cyan">{stat.icon}</span>
              <span className="text-text-primary font-mono font-semibold text-sm">{stat.value}</span>
              <span className="text-text-muted text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tools.map((tool) => {
          const isCyan = tool.accentColor === 'cyan'
          const accentClass = isCyan ? 'text-cyan' : 'text-purple'
          const bgClass = isCyan ? 'bg-cyan/10 border-cyan/20' : 'bg-purple/10 border-purple/20'
          const hoverBorderClass = isCyan ? 'hover:border-cyan/40' : 'hover:border-purple/40'
          const badgeClass = isCyan ? 'badge-cyan' : 'badge-purple'
          const btnClass = isCyan ? 'cyber-btn-primary' : 'cyber-btn-purple'

          return (
            <Link
              key={tool.path}
              to={tool.path}
              className={`
                group block bg-bg-secondary border border-border rounded-xl p-6
                transition-all duration-300 ${hoverBorderClass}
                hover:translate-y-[-2px]
              `}
              style={{}}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = isCyan
                  ? '0 8px 30px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.1)'
                  : '0 8px 30px rgba(139,92,246,0.12), 0 0 0 1px rgba(139,92,246,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${bgClass} ${accentClass}`}>
                  {tool.icon}
                </div>
                {tool.badge && (
                  <span className={badgeClass}>{tool.badge}</span>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-lg font-semibold mb-2 ${accentClass} group-hover:text-glow-${tool.accentColor}`}>
                {tool.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {tool.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {tool.features.map((feat) => (
                  <span
                    key={feat}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-bg-primary border border-border text-text-muted"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-2 text-sm font-semibold ${accentClass} group-hover:gap-3 transition-all duration-200`}>
                <span>Investigar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom info */}
      <div className="mt-8 p-4 rounded-lg bg-bg-secondary border border-border flex items-start gap-3">
        <Shield className="w-4 h-4 text-cyan mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs text-text-secondary font-mono">
            <span className="text-cyan font-semibold">AVISO:</span>{' '}
            Este sistema é destinado exclusivamente para fins de investigação legal e ética.
            Todas as consultas são feitas através de fontes públicas disponíveis na internet.
            Use com responsabilidade e dentro dos limites da lei.
          </p>
        </div>
      </div>
    </div>
  )
}
