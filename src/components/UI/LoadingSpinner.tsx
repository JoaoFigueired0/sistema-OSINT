interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({
  message = 'Processando investigação...',
  size = 'md',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: { outer: 'w-8 h-8', inner: 'w-5 h-5', dot: 'w-1.5 h-1.5' },
    md: { outer: 'w-16 h-16', inner: 'w-10 h-10', dot: 'w-2 h-2' },
    lg: { outer: 'w-24 h-24', inner: 'w-16 h-16', dot: 'w-3 h-3' },
  }

  const s = sizes[size]

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 animate-fade-in">
      {/* Spinner rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className={`${s.outer} rounded-full border-2 border-cyan/20 border-t-cyan animate-spin`}
          style={{ animationDuration: '1s' }}
        />
        {/* Middle ring */}
        <div
          className={`absolute ${s.inner} rounded-full border-2 border-purple/20 border-b-purple animate-spin`}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
        {/* Center dot */}
        <div className={`absolute ${s.dot} rounded-full bg-cyan animate-pulse`} />
      </div>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan via-purple to-cyan rounded-full animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'scan-bar 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <div className="text-center">
          <p className="text-text-secondary text-sm font-mono">{message}</p>
          <p className="text-text-muted text-xs mt-1 font-mono">
            Isso pode levar alguns segundos...
          </p>
        </div>
      )}

      <style>{`
        @keyframes scan-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 80%; margin-left: 10%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
