import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import UsernamePage from './pages/UsernamePage'
import SocialPage from './pages/SocialPage'
import GamesPage from './pages/GamesPage'
import EmailPage from './pages/EmailPage'
import DomainPage from './pages/DomainPage'
import CnpjPage from './pages/CnpjPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="username" element={<UsernamePage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="domain" element={<DomainPage />} />
          <Route path="cnpj" element={<CnpjPage />} />
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="text-6xl font-mono font-bold text-border mb-4">404</div>
      <h2 className="text-xl font-semibold text-text-secondary mb-2">Página não encontrada</h2>
      <p className="text-text-muted text-sm mb-6">
        O módulo que você procura não existe neste sistema.
      </p>
      <a
        href="/"
        className="cyber-btn-primary"
      >
        Voltar ao Dashboard
      </a>
    </div>
  )
}
