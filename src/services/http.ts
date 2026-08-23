/**
 * Cliente HTTP tipado sobre o fetch nativo.
 *
 * Optamos por fetch em vez de axios: os endpoints consumidos são poucos e
 * somente de leitura, então uma dependência a mais não se paga. A tipagem
 * fica no ponto de chamada (ver services/procedures.ts).
 */

const DEFAULT_BASE_URL = 'https://api.postodeenfermagem.com.br/api/v1';

/** Base da API, sempre sem barra no final. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL).replace(
  /\/+$/,
  '',
);

/**
 * As rotas /public/* não exigem token, mas exigem o header X-Tenant-ID: elas
 * continuam atrás do middleware "tenant" da API, que é o que mantém o
 * isolamento multi-tenant ativo. Sem o header, a API responde 400.
 */
export const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? '';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Tenant ausente, inválido ou inativo — erro de configuração, não do usuário. */
  get isTenantProblem(): boolean {
    return this.status === 400 || this.status === 403;
  }
}

export class MissingTenantError extends Error {
  constructor() {
    super(
      'VITE_TENANT_ID não configurado. Copie .env.example para .env e informe o UUID do tenant.',
    );
    this.name = 'MissingTenantError';
  }
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function readErrorMessage(response: Response): Promise<{ message: string; payload: unknown }> {
  try {
    const payload = (await response.json()) as { message?: string };

    return {
      message: payload?.message ?? `Falha na requisição (HTTP ${response.status}).`,
      payload,
    };
  } catch {
    return {
      message: `Falha na requisição (HTTP ${response.status}).`,
      payload: undefined,
    };
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, QueryValue>,
  signal?: AbortSignal,
): Promise<T> {
  if (!TENANT_ID) {
    throw new MissingTenantError();
  }

  const response = await fetch(buildUrl(path, params), {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
      'X-Tenant-ID': TENANT_ID,
    },
  });

  if (!response.ok) {
    const { message, payload } = await readErrorMessage(response);
    throw new ApiError(response.status, message, payload);
  }

  return (await response.json()) as T;
}
