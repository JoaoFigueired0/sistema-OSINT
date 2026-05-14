/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080c14',
          secondary: '#0d1220',
          tertiary: '#111827',
        },
        border: {
          DEFAULT: '#1a2a42',
          bright: '#1e3a5f',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          dark: '#0891b2',
          bright: '#22d3ee',
          glow: 'rgba(6,182,212,0.3)',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          bright: '#a78bfa',
          glow: 'rgba(139,92,246,0.3)',
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#059669',
          glow: 'rgba(16,185,129,0.3)',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          glow: 'rgba(239,68,68,0.3)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#475569',
          cyan: '#06b6d4',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)',
        'cyan-glow-sm': '0 0 10px rgba(6,182,212,0.2)',
        'purple-glow': '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)',
        'purple-glow-sm': '0 0 10px rgba(139,92,246,0.2)',
        'success-glow': '0 0 10px rgba(16,185,129,0.2)',
        'danger-glow': '0 0 10px rgba(239,68,68,0.2)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6,182,212,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(6,182,212,0.6), 0 0 40px rgba(6,182,212,0.2)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
        'cyber-gradient': 'linear-gradient(135deg, #080c14 0%, #0d1220 50%, #080c14 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
