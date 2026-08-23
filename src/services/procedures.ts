import { apiGet } from './http';
import type {
  CategorySummary,
  Paginated,
  Procedure,
  ProcedureListItem,
  ProcedureListParams,
  Resource,
} from '@/types/procedure';

/**
 * Endpoints públicos de Procedimentos de Enfermagem.
 * Só devolvem registros com status "published".
 */

/** GET /public/procedures */
export function fetchProcedures(
  params: ProcedureListParams = {},
  signal?: AbortSignal,
): Promise<Paginated<ProcedureListItem>> {
  return apiGet<Paginated<ProcedureListItem>>(
    '/public/procedures',
    {
      category: params.category,
      search: params.search,
      // A home agrupa tudo por categoria, então puxamos o catálogo inteiro
      // de uma vez em vez de paginar (o teto da API é 100).
      per_page: params.per_page ?? 100,
    },
    signal,
  );
}

/** GET /public/procedures/categories */
export async function fetchCategories(signal?: AbortSignal): Promise<CategorySummary[]> {
  const response = await apiGet<Resource<CategorySummary[]>>(
    '/public/procedures/categories',
    undefined,
    signal,
  );

  return response.data;
}

/** GET /public/procedures/{slug} */
export async function fetchProcedureBySlug(slug: string, signal?: AbortSignal): Promise<Procedure> {
  const response = await apiGet<Resource<Procedure>>(
    `/public/procedures/${encodeURIComponent(slug)}`,
    undefined,
    signal,
  );

  return response.data;
}
