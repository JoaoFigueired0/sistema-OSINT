import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export default function CopyButton({ text, className = '', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const btnSize = size === 'sm' ? 'p-1' : 'p-1.5'

  return (
    <button
      onClick={handleCopy}
      className={`
        ${btnSize} rounded transition-all duration-200 flex-shrink-0
        ${copied
          ? 'text-success bg-success/10 border border-success/20'
          : 'text-text-muted hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/20'
        }
        ${className}
      `}
      title={copied ? 'Copiado!' : 'Copiar'}
    >
      {copied ? (
        <Check className={iconSize} />
      ) : (
        <Copy className={iconSize} />
      )}
    </button>
  )
}
