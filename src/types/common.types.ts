/**
 * Base entity with common identifier and timestamps.
 */
export interface IBaseEntity {
  id: string;
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}

/**
 * Query filters for pagination.
 */
export interface IPaginatedQuery {
  page?: number;
  limit?: number;
}

/**
 * Query filters for date range.
 */
export interface IDateRangeQuery {
  startDate?: string;   // ISO 8601 date-time
  endDate?: string;     // ISO 8601 date-time
}

/**
 * Supported sort order.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Query parameters for sorting.
 */
export interface ISortQuery {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Option shape for dropdowns and select components.
 */
export interface ISelectOption<T = string> {
  label: string;
  value: T;
}

/**
 * Nullable utility type.
 */
export type Nullable<T> = T | null;

/**
 * Maybe utility type (undefined or value).
 */
export type Maybe<T> = T | undefined;

/**
 * Key-value pair generic type.
 */
export interface IKeyValue<V = any> {
  key: string;
  value: V;
}