import { apiClient } from './client';
import type {
  PublicProcedure,
  PaginatedProceduresResponse,
  CategoryCount,
} from '../types/procedure';

export interface ProcedureListParams {
  category?: string;
  search?: string;
  per_page?: number;
}

export async function getPublicProcedures(
  params?: ProcedureListParams
): Promise<PaginatedProceduresResponse> {
  try {
    const response = await apiClient.get<PaginatedProceduresResponse>(
      '/api/v1/public/procedures',
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPublicProcedureBySlug(slug: string): Promise<PublicProcedure> {
  try {
    const response = await apiClient.get<{ data: PublicProcedure } | PublicProcedure>(
      `/api/v1/public/procedures/${encodeURIComponent(slug)}`
    );
    if ('data' in response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as PublicProcedure;
  } catch (error) {
    throw error;
  }
}

export async function getPublicProcedureCategories(): Promise<CategoryCount[]> {
  try {
    const response = await apiClient.get<{ data: CategoryCount[] }>(
      '/api/v1/public/procedures/categories'
    );
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
}
