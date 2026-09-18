import { apiClient } from './client';
import type { ServiceReview, CreateServiceReviewPayload } from '../types/serviceRequest';

export interface PublicReviewsResponse {
  data: ServiceReview[];
}

/**
 * Registra a avaliação/depoimento de uma solicitação de atendimento concluída (EST-15).
 * POST /api/v1/service-requests/{id}/review
 */
export async function createServiceReview(
  serviceRequestId: string,
  payload: CreateServiceReviewPayload
): Promise<ServiceReview> {
  try {
    const response = await apiClient.post<{ data?: ServiceReview } | ServiceReview>(
      `/api/v1/service-requests/${encodeURIComponent(serviceRequestId)}/review`,
      payload
    );
    const body = response.data;
    if (body && typeof body === 'object') {
      if ('data' in body && body.data && typeof body.data === 'object') {
        return body.data as ServiceReview;
      }
      return body as ServiceReview;
    }
    return {
      id: '',
      service_request_id: serviceRequestId,
      stars: payload.stars,
      body: payload.body ?? '',
      anonymous: payload.anonymous,
      publish_requested: payload.publish_requested,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Publica um depoimento de atendimento aprovado por profissional/admin (EST-15).
 * PATCH /api/v1/service-reviews/{id}/publish
 */
export async function publishServiceReview(reviewId: string): Promise<ServiceReview> {
  try {
    const response = await apiClient.patch<{ data?: ServiceReview } | ServiceReview>(
      `/api/v1/service-reviews/${encodeURIComponent(reviewId)}/publish`
    );
    const body = response.data;
    if (body && typeof body === 'object') {
      if ('data' in body && body.data && typeof body.data === 'object') {
        return body.data as ServiceReview;
      }
      return body as ServiceReview;
    }
    return {
      id: reviewId,
      stars: 5,
      body: '',
      anonymous: false,
      publish_requested: true,
      published_at: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Consulta avaliações públicas/depoimentos publicados (EST-15).
 * GET /api/v1/public/reviews?procedure_slug=
 */
export async function getPublicReviews(params?: {
  procedure_slug?: string;
  per_page?: number;
}): Promise<ServiceReview[]> {
  try {
    const response = await apiClient.get<PublicReviewsResponse | { data: ServiceReview[] } | ServiceReview[]>(
      '/api/v1/public/reviews',
      { params }
    );
    const body = response.data;
    if (body && typeof body === 'object') {
      if ('data' in body && Array.isArray(body.data)) {
        return body.data as ServiceReview[];
      }
      if (Array.isArray(body)) {
        return body as ServiceReview[];
      }
    }
    return [];
  } catch (error) {
    throw error;
  }
}
