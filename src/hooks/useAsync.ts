import { useCallback, useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Refaz a requisição mantendo as mesmas dependências. */
  reload: () => void;
}

/**
 * Executa uma função assíncrona ligada ao ciclo de vida do componente.
 *
 * O AbortSignal é repassado para o fetch, então requisições de telas que o
 * usuário abandonou são canceladas em vez de atualizarem estado já
 * desmontado (evita race entre respostas fora de ordem).
 *
 * `deps` controla quando refazer a chamada — mesma semântica de useEffect.
 */
export function useAsync<T>(
  task: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    task(controller.signal)
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return;
        setData(null);
        setError(cause instanceof Error ? cause : new Error('Erro inesperado.'));
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // `task` é recriada a cada render; as dependências reais são as de `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { data, loading, error, reload };
}
