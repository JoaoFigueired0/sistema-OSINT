import client from './client'
import type {
  TwitterResponse,
  InstagramResponse,
  TwitchResponse,
  TikTokResponse,
  ThreadsResponse,
  SnapchatResponse,
  FacebookResponse,
  XboxResponse,
  SocialGeralResponse,
  EmailResponse,
  DomainResponse,
  CnpjResponse,
  NamintResponse,
  OsintUsernameResponse,
  RobloxResponse,
  HytaleResponse,
  MinecraftResponse,
  GameGeralResponse,
} from '../types'

// ─── CNPJ ─────────────────────────────────────────────────────────────────────
export const buscarCnpj = async (cnpj: string): Promise<CnpjResponse> => {
  const { data } = await client.post('/investigacaodigital/buscarcnpj', { cnpj })
  return data
}

// ─── Social Individual ────────────────────────────────────────────────────────
export const buscarTwitter = async (username: string): Promise<TwitterResponse> => {
  const { data } = await client.post('/investigacaodigital/social/twitter', { username })
  return data
}

export const buscarInstagram = async (username: string): Promise<InstagramResponse> => {
  const { data } = await client.post('/investigacaodigital/social/instagramAccount', { username })
  return data
}

export const buscarTwitch = async (username: string): Promise<TwitchResponse> => {
  const { data } = await client.post('/investigacaodigital/social/twitch', { username })
  return data
}

export const buscarTikTok = async (username: string): Promise<TikTokResponse> => {
  const { data } = await client.post('/investigacaodigital/social/tiktok', { username })
  return data
}

export const buscarThreads = async (username: string): Promise<ThreadsResponse> => {
  const { data } = await client.post('/investigacaodigital/social/threads', { username })
  return data
}

export const buscarSnapchat = async (username: string): Promise<SnapchatResponse> => {
  const { data } = await client.post('/investigacaodigital/social/snapchat', { username })
  return data
}

export const buscarFacebook = async (username: string): Promise<FacebookResponse> => {
  const { data } = await client.post('/investigacaodigital/social/facebook', { username })
  return data
}

export const buscarXbox = async (username: string): Promise<XboxResponse> => {
  const { data } = await client.post('/investigacaodigital/social/xbox', { username })
  return data
}

// ─── Social Geral ─────────────────────────────────────────────────────────────
export const buscarSocialGeral = async (username: string): Promise<SocialGeralResponse> => {
  const { data } = await client.post('/investigacaodigital/social/geral', { username })
  return data
}

// ─── Namint ───────────────────────────────────────────────────────────────────
export const buscarNamint = async (username: string): Promise<NamintResponse> => {
  const { data } = await client.post('/investigacaodigital/namint', { username })
  return data
}

// ─── Email ────────────────────────────────────────────────────────────────────
export const buscarEmail = async (email: string): Promise<EmailResponse> => {
  const { data } = await client.post('/investigacaodigital/email', { email })
  return data
}

// ─── Domain ───────────────────────────────────────────────────────────────────
export const buscarDominio = async (domain: string): Promise<DomainResponse> => {
  const { data } = await client.post('/investigacaodigital/dominio/siteSearch', { domain })
  return data
}

// ─── Games Individual ─────────────────────────────────────────────────────────
export const buscarRoblox = async (username: string): Promise<RobloxResponse> => {
  const { data } = await client.post('/investigacaodigital/jogo/roblox', { username })
  return data
}

export const buscarHytale = async (username: string): Promise<HytaleResponse> => {
  const { data } = await client.post('/investigacaodigital/jogo/hytale', { username })
  return data
}

export const buscarMinecraft = async (username: string): Promise<MinecraftResponse> => {
  const { data } = await client.post('/investigacaodigital/jogo/minecraft', { username })
  return data
}

// ─── Games Geral ──────────────────────────────────────────────────────────────
export const buscarGameGeral = async (username: string): Promise<GameGeralResponse> => {
  const { data } = await client.post('/investigacaodigital/jogo/geral', { username })
  return data
}

// ─── OSINT Username (Sherlock + Maigret) ──────────────────────────────────────
export const buscarOsintUsername = async (username: string): Promise<OsintUsernameResponse> => {
  const { data } = await client.post('/investigacaodigital/osint/username', { username })
  return data
}
