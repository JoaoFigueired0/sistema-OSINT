import { type FormEvent, type KeyboardEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  loading?: boolean
  label?: string
  hint?: string
  type?: string
}

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Digite para pesquisar...',
  loading = false,
  label,
  hint,
  type = 'text',
}: SearchInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!loading && value.trim()) {
      onSearch()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && value.trim()) {
      onSearch()
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-muted" />
          </div>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            className="cyber-input pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="cyber-btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Investigar</span>
            </>
          )}
        </button>
      </form>
      {hint && (
        <p className="mt-2 text-xs text-text-muted font-mono">{hint}</p>
      )}
    </div>
  )
}
