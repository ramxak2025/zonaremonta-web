export const ROLES = {
  CLIENT: 'CLIENT',
  MASTER: 'MASTER',
  DIRECTOR: 'DIRECTOR',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const STAFF_ROLES: readonly Role[] = [ROLES.MASTER, ROLES.DIRECTOR] as const;
