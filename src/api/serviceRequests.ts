import { apiClient } from './client';
import type {
  ServiceRequest,
  CreateServiceRequestPayload,
  ServiceRequestStatus,
} from '../types/serviceRequest';
import type { PaginationMeta } from '../types/procedure';

export interface ServiceRequestListResponse {
  data: ServiceRequest[];
  meta?: PaginationMeta;
}

export async function createServiceRequest(
  payload: CreateServiceRequestPayload
): Promise<ServiceRequest> {
  try {
    const response = await apiClient.post<{ data: ServiceRequest } | ServiceRequest>(
      '/api/v1/service-requests',
      payload
    );
    if ('data' in response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as ServiceRequest;
  } catch (error) {
    throw error;
  }
}

export async function getServiceRequests(params?: {
  status?: string;
  per_page?: number;
}): Promise<ServiceRequestListResponse> {
  try {
    const response = await apiClient.get<ServiceRequestListResponse | { data: ServiceRequest[] }>(
      '/api/v1/service-requests',
      { params }
    );
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data as ServiceRequestListResponse;
    }
    return { data: [] };
  } catch (error) {
    throw error;
  }
}

export async function getServiceRequestById(id: string): Promise<ServiceRequest> {
  try {
    const response = await apiClient.get<{ data: ServiceRequest } | ServiceRequest>(
      `/api/v1/service-requests/${encodeURIComponent(id)}`
    );
    if ('data' in response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as ServiceRequest;
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza o status de uma solicitação de atendimento (EST-15).
 * PATCH /api/v1/service-requests/{id}
 */
export async function updateStatus(
  id: string,
  status: ServiceRequestStatus
): Promise<ServiceRequest> {
  try {
    const response = await apiClient.patch<{ data?: ServiceRequest; message?: string } | ServiceRequest>(
      `/api/v1/service-requests/${encodeURIComponent(id)}`,
      { status }
    );
    const body = response.data;
    if (body && typeof body === 'object') {
      if ('data' in body && body.data && typeof body.data === 'object') {
        return body.data as ServiceRequest;
      }
      if ('id' in body) {
        return body as ServiceRequest;
      }
    }
    return { id, status } as ServiceRequest;
  } catch (error) {
    throw error;
  }
}

export {
  createServiceReview,
  publishServiceReview,
  getPublicReviews,
} from './reviews';

