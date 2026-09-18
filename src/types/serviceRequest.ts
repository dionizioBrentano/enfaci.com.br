export type SlotWindow = 'manha' | 'tarde' | 'noite';

export type ServiceRequestStatus = 'requested' | 'accepted' | 'done' | 'cancelled';

export interface CreateServiceRequestPayload {
  procedure_slug: string;
  cep_servico: string;
  slot_date: string;
  slot_window: SlotWindow;
  offering_id?: string | null;
  service_point_id?: string | null;
  notes_cliente?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ServiceRequestProcedure {
  id: string;
  title: string;
  slug: string;
}

export interface ServiceRequestPoint {
  id: string;
  name: string;
  cep: string;
}

export interface ServiceReview {
  id: string;
  service_request_id?: string;
  stars: number;
  body: string | null;
  anonymous: boolean;
  publish_requested: boolean;
  published_at?: string | null;
  client_name?: string | null;
  user_name?: string | null;
  user?: {
    id?: string | number;
    name?: string;
  } | null;
  procedure?: {
    id?: string;
    title?: string;
    slug?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateServiceReviewPayload {
  stars: number;
  body?: string | null;
  anonymous: boolean;
  publish_requested: boolean;
}

export interface ServiceRequest {
  id: string;
  tenant_id?: string;
  client_user_id?: string;
  offering_id?: string | null;
  service_point_id?: string | null;
  procedure_id?: string;
  procedure?: ServiceRequestProcedure | null;
  service_point?: ServiceRequestPoint | null;
  cep_servico: string;
  latitude?: number | null;
  longitude?: number | null;
  slot_date: string;
  slot_window: SlotWindow;
  status: ServiceRequestStatus;
  notes_cliente?: string | null;
  review?: ServiceReview | null;
  created_at?: string;
  updated_at?: string;
}
