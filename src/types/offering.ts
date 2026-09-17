export interface PublicOffering {
  id: string;
  offering_id: string;
  service_point_id: string;
  name: string;
  quality_score: number | null;
  cep: string;
  coverage_km: number | null;
  procedure_slug: string;
  procedure_title?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface OfferingSearchParams {
  procedure_slug: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
}
