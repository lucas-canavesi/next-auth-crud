export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isAdmin(role: UserRole): boolean {
  return role === USER_ROLES.ADMIN;
}

export function isUser(role: UserRole): boolean {
  return role === USER_ROLES.USER;
}