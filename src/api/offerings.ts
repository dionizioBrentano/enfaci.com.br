import { apiClient } from './client';
import type { PublicOffering, OfferingSearchParams } from '../types/offering';

export async function searchOfferings(params: OfferingSearchParams): Promise<PublicOffering[]> {
  try {
    const response = await apiClient.get<{ data: PublicOffering[] } | PublicOffering[]>(
      '/api/v1/public/offerings/search',
      { params }
    );
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    throw error;
  }
}
