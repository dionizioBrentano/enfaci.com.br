import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProcedures } from '@/services/procedures';
import { useAsync } from '@/hooks/useAsync';
import { ProcedureCard } from '@/components/ProcedureCard';
import { CardSkeleton, EmptyState, ErrorState } from '@/components/States';
import type { CategorySummary, ProcedureListItem } from '@/types/procedure';

interface CategoryGroup {
  value: string;
  label: string;
  items: ProcedureListItem[];
}

/**
 * Agrupa a listagem por categoria, respeitando a ordem em que a API
 * devolve as categorias. Categorias sem procedimento no resultado atual
 * (por causa de um filtro de busca, por exemplo) ficam de fora.
 */
function groupByCategory(
  procedures: ProcedureListItem[],
  categories: CategorySummary[],
): CategoryGroup[] {
  const byCategory = new Map<string, ProcedureListItem[]>();

  for (const procedure of procedures) {
    const bucket = byCategory.get(procedure.category);
    if (bucket) {
      bucket.push(procedure);
    } else {
      byCategory.set(procedure.category, [procedure]);
    }
  }

  const groups: CategoryGroup[] = [];

  for (const category of categories) {
    const items = byCategory.get(category.value);
    if (items?.length) {
      groups.push({ value: category.value, label: category.label, items });
      byCategory.delete(category.value);
    }
  }

  // Rede de segurança: se a API passar a devolver uma categoria nova que o
  // endpoint de categorias ainda não lista, ela aparece assim mesmo.
  for (const [value, items] of byCategory) {
    groups.push({ value, label: items[0]?.category_label ?? value, items });
  }

  return groups;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('busca') ?? '';
  const [term, setTerm] = useState(search);

  // Mantém o campo em sincronia quando a URL muda por fora (voltar/avançar).
  useEffect(() => setTerm(search), [search]);

  const categoriesState = useAsync((signal) => fetchCategories(signal), []);
  const proceduresState = useAsync(
    (signal) => fetchProcedures({ search: search || undefined }, signal),
    [search],
  );

  const groups = useMemo(() => {
    if (!proceduresState.data) return [];
    return groupByCategory(proceduresState.data.data, categoriesState.data ?? []);
  }, [proceduresState.data, categoriesState.data]);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const next = term.trim();
      setSearchParams(next ? { busca: next } : {}, { replace: true });
    },
    [term, setSearchParams],
  );

  const clear = useCallback(() => {
    setTerm('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const total = proceduresState.data?.meta.total ?? 0;

  return (
    <>
      <section className="bg-linear-to-b from-brand-700 to-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
            Procedimentos de enfermagem, do jeito que você precisa na hora do cuidado
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-100 sm:text-base">
            Técnica passo a passo, materiais necessários e pontos de atenção — organizados por
            categoria e escritos para consulta rápida.
          </p>

          <form onSubmit={submit} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label htmlFor="busca" className="sr-only">
              Buscar procedimento
            </label>
            <input
              id="busca"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar por título ou resumo…"
              className="w-full rounded-full bg-white px-5 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-900"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {search ? (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <p className="text-sm text-brand-700">
              {proceduresState.loading
                ? 'Buscando…'
                : `${total} ${total === 1 ? 'resultado' : 'resultados'} para “${search}”`}
            </p>
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50"
            >
              Limpar busca
            </button>
          </div>
        ) : null}

        {proceduresState.loading ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <CardSkeleton />
              </li>
            ))}
          </ul>
        ) : null}

        {!proceduresState.loading && proceduresState.error ? (
          <ErrorState error={proceduresState.error} onRetry={proceduresState.reload} />
        ) : null}

        {!proceduresState.loading && !proceduresState.error && groups.length === 0 ? (
          <EmptyState
            title="Nenhum procedimento encontrado"
            detail={
              search
                ? 'Tente outro termo de busca ou limpe o filtro para ver o catálogo completo.'
                : 'Ainda não há procedimentos publicados para esta instituição.'
            }
          />
        ) : null}

        {!proceduresState.loading && !proceduresState.error && groups.length > 0 ? (
          <div className="flex flex-col gap-12">
            {groups.map((group) => (
              <section key={group.value} aria-labelledby={`cat-${group.value}`}>
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-brand-100 pb-3">
                  <h2
                    id={`cat-${group.value}`}
                    className="text-lg font-bold text-brand-800 sm:text-xl"
                  >
                    {group.label}
                  </h2>
                  <span className="shrink-0 text-xs text-brand-500">
                    {group.items.length}{' '}
                    {group.items.length === 1 ? 'procedimento' : 'procedimentos'}
                  </span>
                </div>

                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((procedure) => (
                    <ProcedureCard key={procedure.id} procedure={procedure} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
