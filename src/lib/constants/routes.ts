export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  ADMIN_USERS: "/admin/users",
  ADMIN_USERS_NEW: "/admin/users/new",
  ADMIN_USERS_EDIT: (id: number | string) => `/admin/users/${id}/edit`,
} as const;

export type RouteKey = keyof typeof ROUTES;