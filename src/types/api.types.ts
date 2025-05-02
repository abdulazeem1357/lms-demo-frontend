/**
 * Detail for a specific field error.
 */
export interface TApiErrorDetail {
  field: string;
  issue: string;
}

/**
 * Standard API error format.
 */
export interface TApiError {
  code: string;
  message: string;
  details?: TApiErrorDetail[];
}

/**
 * Error response payload from the API.
 */
export interface TApiErrorResponse {
  error: TApiError;
}

/**
 * Pagination metadata for list responses.
 */
export interface TApiPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Generic success response for a single resource.
 */
export interface TApiSingleResponse<T> {
  data: T;
}

/**
 * Generic success response for a list of resources.
 */
export interface TApiListResponse<T> {
  data: T[];
  meta: TApiPagination;
}

/**
 * Unified API response type for success payloads.
 */
export type TApiResponse<T> =
  | TApiSingleResponse<T>
  | TApiListResponse<T>;