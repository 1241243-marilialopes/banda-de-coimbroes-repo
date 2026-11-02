import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'banda_de_coimbroes_jwt_secret_key_2026'
);

export const COOKIE_NAME = 'auth_token';

export interface UserSession {
  id: number;
  nome: string;
  email: string;
  cargo: number; // 0 = Admin, 1 = Músico/Sócio, 2 = Admin/Músico/Sócio, 3 = Sócio
  instrumento?: number | null;
}

/**
 * Verifica se a senha fornecida corresponde ao hash armazenado na BD (criado via PHP password_hash)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash || !password) return false;
  // Compatibilidade com hashes bcrypt gerados por PHP ($2y$)
  const normalizedHash = hash.replace(/^\$2y\$/, '$2a$');
  try {
    return await bcrypt.compare(password, normalizedHash);
  } catch (err) {
    console.error('Erro ao verificar password:', err);
    return false;
  }
}

/**
 * Cria um novo hash de palavra-passe compatível com bcrypt do PHP
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Gera um token de sessão assinado
 */
export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Valida e descodifica o token de sessão
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: Number(payload.id),
      nome: String(payload.nome),
      email: String(payload.email),
      cargo: Number(payload.cargo),
      instrumento: payload.instrumento ? Number(payload.instrumento) : null,
    };
  } catch {
    return null;
  }
}

/**
 * Obtém a sessão atual a partir dos cookies do pedido
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Devolve o caminho do painel correto de acordo com o cargo_id
 */
export function getDashboardPath(cargo: number): string {
  switch (cargo) {
    case 0:
      return '/admin';
    case 1:
      return '/musicos-socios';
    case 2:
      return '/admin-musico-socio';
    case 3:
      return '/socios';
    default:
      return '/';
  }
}

