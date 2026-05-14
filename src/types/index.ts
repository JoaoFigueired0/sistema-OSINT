// ─── Twitter ──────────────────────────────────────────────────────────────────
export interface TwitterResponse {
  status: string
  username: string
  nome: string
  id: string | number
  banner: string
  criado_em: string
  verificado_blue: boolean
  bio: string
  tweets: number | string
}

// ─── Instagram ────────────────────────────────────────────────────────────────
export interface InstagramResponse {
  Conta: string
  Nome: string
  Bio: string
  Id: string | number
  'Foto Perfil': string
}

// ─── Twitch ───────────────────────────────────────────────────────────────────
export interface TwitchResponse {
  [key: string]: unknown
}

// ─── TikTok ───────────────────────────────────────────────────────────────────
export interface TikTokResponse {
  [key: string]: unknown
}

// ─── Threads ──────────────────────────────────────────────────────────────────
export interface ThreadsResponse {
  [key: string]: unknown
}

// ─── Snapchat ─────────────────────────────────────────────────────────────────
export interface SnapchatResponse {
  [key: string]: unknown
}

// ─── Facebook ─────────────────────────────────────────────────────────────────
export interface FacebookResponse {
  [key: string]: unknown
}

// ─── Xbox ─────────────────────────────────────────────────────────────────────
export interface XboxResponse {
  [key: string]: unknown
}

// ─── Social Platform Result (used in geral) ───────────────────────────────────
export interface SocialPlatformResult {
  success: boolean
  status?: string | number
  data?: unknown
  error?: string
}

// ─── Social Geral ─────────────────────────────────────────────────────────────
export interface SocialGeralResponse {
  instagram?: SocialPlatformResult
  threads?: SocialPlatformResult
  tiktok?: SocialPlatformResult
  twitter?: SocialPlatformResult
  snapchat?: SocialPlatformResult
  twitch?: SocialPlatformResult
  facebook?: SocialPlatformResult
  xbox?: SocialPlatformResult
  [key: string]: SocialPlatformResult | undefined
}

// ─── Email ────────────────────────────────────────────────────────────────────
export interface EmailResponse {
  Valido: boolean | string
  Bloqueado: boolean | string
  Disponivel: boolean | string
  Encaminhador: boolean | string
  'Dominio Email': string
  Tipo: string
  Classificação: string
  Host: string
  'Erro de digitação': string | null
  'Servidor de e-mail': string
  'Endereço IP': string
}

// ─── Domain ───────────────────────────────────────────────────────────────────
export interface DomainResponse {
  [key: string]: unknown
}

// ─── CNPJ ─────────────────────────────────────────────────────────────────────
export interface CnpjResponse {
  [key: string]: unknown
}

// ─── Namint ───────────────────────────────────────────────────────────────────
export interface NamintResponse {
  [key: string]: unknown
}

// ─── OSINT (Sherlock + Maigret) ───────────────────────────────────────────────
export interface SherlockResult {
  site: string
  url: string
  found: boolean
}

export interface MaigretResult {
  site: string
  url: string
  found: boolean
  ids?: Record<string, string>
}

export interface OsintUsernameResponse {
  username: string
  sherlock: SherlockResult[]
  maigret: MaigretResult[]
}

// ─── Games ────────────────────────────────────────────────────────────────────
export interface RobloxResponse {
  [key: string]: unknown
}

export interface HytaleResponse {
  [key: string]: unknown
}

export interface MinecraftResponse {
  [key: string]: unknown
}

export interface GamePlatformResult {
  success: boolean
  status?: string | number
  data?: unknown
  error?: string
}

export interface GameGeralResponse {
  roblox?: GamePlatformResult
  hytale?: GamePlatformResult
  minecraft?: GamePlatformResult
  [key: string]: GamePlatformResult | undefined
}

// ─── Generic API Error ────────────────────────────────────────────────────────
export interface ApiError {
  message: string
  status?: number
}
