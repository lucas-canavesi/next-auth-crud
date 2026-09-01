export type UserRole = "USER" | "ADMIN";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthUser = User;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  message: string;
};

export type UsersListResponse = AuthUser[];

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserResponse = AuthUser;

export type UpdateUserRequest = {
  name: string;
  email: string;
};

export type UpdateUserResponse = AuthUser;

export type DeleteUserResponse = {
  message: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export type ApiErrorResponse = {
  error: string;
};