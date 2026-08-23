/**
 * Tipos espelhando os recursos públicos da API do Posto de Enfermagem
 * (App\Http\Resources\PublicProcedureResource e PublicProcedureListResource).
 *
 * A API remove chaves nulas da resposta, então praticamente todo campo
 * opcional pode simplesmente não vir — daí o uso de `?` em vez de `| null`.
 */

export type ProcedureCategory =
  | 'aplicacao_medicamentos'
  | 'curativos_feridas'
  | 'eliminacoes'
  | 'vias_aereas'
  | 'sondas_alimentares'
  | 'outros';

/** Item de listagem: não traz o corpo do conteúdo nem a galeria. */
export interface ProcedureListItem {
  id: string;
  title: string;
  slug: string;
  category: ProcedureCategory;
  category_label: string;
  short_description?: string;
  featured_image?: string;
  order: number;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

/** Detalhe: acrescenta o conteúdo rico e a galeria. */
export interface Procedure extends ProcedureListItem {
  content: string;
  gallery?: string[];
}

export interface CategorySummary {
  value: ProcedureCategory;
  label: string;
  total: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

/** Envelope das coleções paginadas do Laravel. */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Envelope de recurso único do Laravel. */
export interface Resource<T> {
  data: T;
}

export interface ProcedureListParams {
  category?: ProcedureCategory | '';
  search?: string;
  per_page?: number;
}
