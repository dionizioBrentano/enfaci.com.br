export type ProcedureCategory =
  | 'aplicacao_medicamentos'
  | 'curativos_feridas'
  | 'eliminacoes'
  | 'vias_aereas'
  | 'sondas_alimentares'
  | 'outros';

export interface PublicProcedure {
  id: string;
  title: string;
  slug: string;
  category: ProcedureCategory;
  category_label: string;
  short_description: string;
  content?: string;
  featured_image?: string | null;
  gallery?: string[];
  order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string;
}

export interface CategoryCount {
  value: ProcedureCategory;
  label: string;
  total: number;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedProceduresResponse {
  data: PublicProcedure[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}
