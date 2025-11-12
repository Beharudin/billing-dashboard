export const ROLES = {
  ADMIN: "ADMIN",
  PARTNER_SUB_ADMIN: "PARTNER_SUB_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
