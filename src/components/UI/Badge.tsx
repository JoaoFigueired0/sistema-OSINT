import { CheckCircle2, XCircle, AlertCircle, Info, Circle } from 'lucide-react'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'cyan' | 'purple' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  icon?: boolean
  dot?: boolean
}

const variantConfig: Record<BadgeVariant, { class: string; icon: React.ReactNode; dotColor: string }> = {
  success: {
    class: 'badge-success',
    icon: <CheckCircle2 className="w-3 h-3" />,
    dotColor: 'bg-success',
  },
  danger: {
    class: 'badge-danger',
    icon: <XCircle className="w-3 h-3" />,
    dotColor: 'bg-danger',
  },
  warning: {
    class: 'badge-warning',
    icon: <AlertCircle className="w-3 h-3" />,
    dotColor: 'bg-warning',
  },
  cyan: {
    class: 'badge-cyan',
    icon: <Info className="w-3 h-3" />,
    dotColor: 'bg-cyan',
  },
  purple: {
    class: 'badge-purple',
    icon: <Circle className="w-3 h-3" />,
    dotColor: 'bg-purple',
  },
  muted: {
    class: 'badge-muted',
    icon: <Circle className="w-3 h-3" />,
    dotColor: 'bg-text-muted',
  },
}

export default function Badge({ variant = 'muted', children, icon = false, dot = false }: BadgeProps) {
  const config = variantConfig[variant]

  return (
    <span className={config.class}>
      {icon && config.icon}
      {dot && !icon && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} inline-block`} />
      )}
      {children}
    </span>
  )
}

// Convenience components
export function BooleanBadge({ value, trueLabel = 'Sim', falseLabel = 'Não' }: { value: boolean | string | null | undefined; trueLabel?: string; falseLabel?: string }) {
  const isTrue = value === true || value === 'true' || value === 'Sim' || value === 'sim'
  return (
    <Badge variant={isTrue ? 'success' : 'danger'} icon>
      {isTrue ? trueLabel : falseLabel}
    </Badge>
  )
}

export function StatusBadge({ found }: { found: boolean }) {
  return (
    <Badge variant={found ? 'success' : 'muted'} dot>
      {found ? 'Encontrado' : 'Não encontrado'}
    </Badge>
  )
}
