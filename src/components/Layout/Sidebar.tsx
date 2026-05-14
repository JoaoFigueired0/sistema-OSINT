import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Users,
  Gamepad2,
  Mail,
  Globe,
  Building2,
  Shield,
  ChevronRight,
  Activity,
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  description: string
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    description: 'Visão geral',
  },
  {
    path: '/username',
    label: 'Username / OSINT',
    icon: <Search className="w-4 h-4" />,
    description: 'Sherlock + Maigret',
  },
  {
    path: '/social',
    label: 'Redes Sociais',
    icon: <Users className="w-4 h-4" />,
    description: 'Instagram, Twitter...',
  },
  {
    path: '/games',
    label: 'Jogos',
    icon: <Gamepad2 className="w-4 h-4" />,
    description: 'Roblox, Minecraft...',
  },
  {
    path: '/email',
    label: 'E-mail',
    icon: <Mail className="w-4 h-4" />,
    description: 'Validação de e-mail',
  },
  {
    path: '/domain',
    label: 'Domínio / WHOIS',
    icon: <Globe className="w-4 h-4" />,
    description: 'Consulta de domínio',
  },
  {
    path: '/cnpj',
    label: 'CNPJ',
    icon: <Building2 className="w-4 h-4" />,
    description: 'Dados empresariais',
  },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className="flex flex-col h-full bg-bg-secondary border-r border-border sidebar-pattern">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-cyan/10 border border-cyan/30" />
            <Shield className="w-5 h-5 text-cyan relative z-10" />
            <div className="absolute inset-0 rounded-lg animate-pulse" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.3)' }} />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-cyan text-glow-cyan tracking-wider">
              OSINT SYS
            </div>
            <div className="text-xs text-text-muted font-mono">
              v2.0 — Investigação Digital
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded bg-bg-primary border border-border">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            <div className="relative rounded-full w-2 h-2 bg-success" />
          </div>
          <Activity className="w-3 h-3 text-text-muted" />
          <span className="text-xs font-mono text-text-secondary">Sistema ativo</span>
          <span className="ml-auto text-xs font-mono text-text-muted">:3000</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-3 px-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-text-muted">
            Módulos
          </span>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary border border-transparent'
                    }
                  `}
                  style={isActive ? { boxShadow: '0 0 10px rgba(6,182,212,0.1)' } : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan rounded-r" />
                  )}

                  <span className={`flex-shrink-0 ${isActive ? 'text-cyan' : 'text-text-muted group-hover:text-text-secondary'}`}>
                    {item.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${isActive ? 'text-glow-cyan' : ''}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-text-muted truncate font-mono">
                      {item.description}
                    </div>
                  </div>

                  {isActive && (
                    <ChevronRight className="w-3 h-3 text-cyan flex-shrink-0" />
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border flex-shrink-0">
        <div className="text-center">
          <p className="text-xs font-mono text-text-muted">
            OSINT Investigation System
          </p>
          <p className="text-xs font-mono text-text-muted mt-0.5">
            Backend: <span className="text-cyan">onrender.com</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
