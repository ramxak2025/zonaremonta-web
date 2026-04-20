import type { Role } from '../constants/roles';

export interface AuthUser {
  id: string;
  role: Role;
  clientId?: string;
  masterId?: string;
  phone?: string;
  email?: string;
  name?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Id = string;

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
