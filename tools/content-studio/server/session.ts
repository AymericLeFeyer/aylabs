import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import type { ServerConfig } from './config';

// La session contient le jeton GitHub de l'utilisateur : elle est CHIFFRÉE
// (AES-256-GCM), pas seulement signée. Un cookie signé resterait lisible côté
// navigateur, ce qui exposerait un jeton capable d'écrire sur le dépôt.
//
// Pas de base de données : l'outil est sans état, le cookie porte tout. C'est ce
// qui permet de le déployer comme un simple conteneur.

const SESSION_COOKIE = 'aylabs_studio_session';
const STATE_COOKIE = 'aylabs_studio_oauth_state';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 h — une session de travail.
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export interface Session {
  login: string;
  name: string;
  avatarUrl: string;
  canWrite: boolean;
  accessToken: string;
  expiresAt: number;
}

const keyFrom = (secret: string): Buffer => createHash('sha256').update(secret).digest();

function encrypt(plaintext: string, secret: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', keyFrom(secret), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

function decrypt(payload: string, secret: string): string | null {
  try {
    const raw = Buffer.from(payload, 'base64url');
    if (raw.length <= IV_LENGTH + TAG_LENGTH) return null;

    const iv = raw.subarray(0, IV_LENGTH);
    const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const body = raw.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv('aes-256-gcm', keyFrom(secret), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
  } catch {
    // Cookie corrompu, forgé, ou chiffré avec un ancien SESSION_SECRET.
    return null;
  }
}

/* ────────────────────────────── Cookies ────────────────────────────── */

export const parseCookies = (header: string | undefined): Record<string, string> => {
  const jar: Record<string, string> = {};
  if (!header) return jar;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    jar[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return jar;
};

const serializeCookie = (
  name: string,
  value: string,
  options: { maxAge: number; secure: boolean }
): string =>
  [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    options.secure ? 'Secure' : '',
    `Max-Age=${options.maxAge}`,
  ]
    .filter(Boolean)
    .join('; ');

/** Le TLS est assuré par le reverse proxy : c'est l'URL publique qui fait foi. */
const secureCookies = (config: ServerConfig): boolean => config.appUrl.startsWith('https://');

/* ────────────────────────────── Session ────────────────────────────── */

export function sessionCookie(
  session: Omit<Session, 'expiresAt'>,
  config: ServerConfig
): string {
  const payload: Session = { ...session, expiresAt: Date.now() + SESSION_TTL_MS };
  return serializeCookie(SESSION_COOKIE, encrypt(JSON.stringify(payload), config.sessionSecret), {
    maxAge: SESSION_TTL_MS / 1000,
    secure: secureCookies(config),
  });
}

export function readSession(
  cookieHeader: string | undefined,
  config: ServerConfig
): Session | null {
  const raw = parseCookies(cookieHeader)[SESSION_COOKIE];
  if (!raw) return null;

  const plaintext = decrypt(raw, config.sessionSecret);
  if (!plaintext) return null;

  try {
    const session = JSON.parse(plaintext) as Session;
    if (!session.accessToken || session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const clearSessionCookie = (config: ServerConfig): string =>
  serializeCookie(SESSION_COOKIE, '', { maxAge: 0, secure: secureCookies(config) });

/* ─────────────────── Protection CSRF du flux OAuth ─────────────────── */

/**
 * Génère le `state` OAuth et le mémorise dans un cookie éphémère. Sans cette
 * vérification, un tiers pourrait faire aboutir un flux d'authentification qu'il
 * a lui-même initié dans le navigateur de l'utilisateur.
 */
export function issueOAuthState(config: ServerConfig): { state: string; cookie: string } {
  const state = randomBytes(32).toString('base64url');
  return {
    state,
    cookie: serializeCookie(STATE_COOKIE, state, {
      maxAge: 600, // 10 min pour aller au bout du login GitHub.
      secure: secureCookies(config),
    }),
  };
}

export function verifyOAuthState(
  cookieHeader: string | undefined,
  received: string | null
): boolean {
  const expected = parseCookies(cookieHeader)[STATE_COOKIE];
  if (!expected || !received) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const clearStateCookie = (config: ServerConfig): string =>
  serializeCookie(STATE_COOKIE, '', { maxAge: 0, secure: secureCookies(config) });
