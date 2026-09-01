import type {
  LoginCredentials,
  LoginResponse,
  MeResponse,
  LogoutResponse,
  UsersListResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/user";
import { ApiError, type ApiResult } from "@/types/api";

const API_BASE = "";

async function handleResponse<T>(response: Response): Promise<ApiResult<T>> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { ok: false, error: ApiError.fromResponse(response, data) };
  }

  return { ok: true, data: data as T };
}

export async function login(credentials: LoginCredentials): Promise<ApiResult<LoginResponse>> {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  return handleResponse<LoginResponse>(response);
}

export async function logout(): Promise<ApiResult<LogoutResponse>> {
  const response = await fetch(`${API_BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse<LogoutResponse>(response);
}

export async function getMe(): Promise<ApiResult<MeResponse>> {
  const response = await fetch(`${API_BASE}/api/me`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse<MeResponse>(response);
}

export async function getUsers(): Promise<ApiResult<UsersListResponse>> {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse<UsersListResponse>(response);
}

export async function createUser(userData: CreateUserRequest): Promise<ApiResult<CreateUserResponse>> {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  return handleResponse<CreateUserResponse>(response);
}

export async function updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResult<UpdateUserResponse>> {
  const response = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  return handleResponse<UpdateUserResponse>(response);
}

export async function deleteUser(id: number): Promise<ApiResult<DeleteUserResponse>> {
  const response = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse<DeleteUserResponse>(response);
}

export async function changePassword(data: ChangePasswordRequest): Promise<ApiResult<ChangePasswordResponse>> {
  const response = await fetch(`${API_BASE}/api/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse<ChangePasswordResponse>(response);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado";
}