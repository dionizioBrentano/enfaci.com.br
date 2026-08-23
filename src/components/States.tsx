import { ApiError, MissingTenantError } from '@/services/http';

export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
      <span className="text-sm text-brand-700">{label}</span>
    </div>
  );
}

/** Esqueleto de cartão, usado enquanto a listagem carrega. */
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-brand-100 bg-white p-5">
      <div className="h-4 w-24 rounded-full bg-brand-100" />
      <div className="mt-4 h-5 w-3/4 rounded bg-brand-100" />
      <div className="mt-3 h-3 w-full rounded bg-brand-50" />
      <div className="mt-2 h-3 w-5/6 rounded bg-brand-50" />
    </div>
  );
}

/**
 * Converte a falha em uma mensagem acionável. Erro de tenant é problema de
 * configuração do ambiente, não do usuário — vale dizer isso explicitamente
 * em vez de mostrar um "algo deu errado" genérico.
 */
function describe(error: Error): { title: string; detail: string; hint?: string } {
  if (error instanceof MissingTenantError) {
    return {
      title: 'Configuração incompleta',
      detail: 'O identificador do tenant não foi informado nesta instalação.',
      hint: 'Copie .env.example para .env e preencha VITE_TENANT_ID com o UUID do tenant.',
    };
  }

  if (error instanceof ApiError && error.isTenantProblem) {
    return {
      title: 'Tenant não aceito pela API',
      detail: error.message,
      hint: 'Confira se o VITE_TENANT_ID corresponde a um tenant ativo.',
    };
  }

  if (error instanceof ApiError) {
    return { title: 'Não foi possível carregar', detail: error.message };
  }

  return {
    title: 'Não foi possível carregar',
    detail: 'Verifique sua conexão e tente novamente.',
  };
}

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { title, detail, hint } = describe(error);

  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"
    >
      <h2 className="text-lg font-semibold text-amber-900">{title}</h2>
      <p className="mt-2 text-sm text-amber-800">{detail}</p>
      {hint ? <p className="mt-2 text-xs text-amber-700">{hint}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-brand-200 bg-white p-10 text-center">
      <h2 className="text-lg font-semibold text-brand-800">{title}</h2>
      <p className="mt-2 text-sm text-brand-600">{detail}</p>
    </div>
  );
}
