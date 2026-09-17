import { apiClient } from './client';
import type {
  ServiceRequest,
  CreateServiceRequestPayload,
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
