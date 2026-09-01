"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { AuthUser } from "@/types/user";
import { login as apiLogin, logout as apiLogout, getMe } from "@/lib/api";

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  const refresh = useCallback(async () => {
    const result = await getMe();
    if (result.ok) {
      setUser(result.data.user);
    } else {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin({ email, password });
    if (!result.ok) {
      throw result.error;
    }
    await refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      const result = await getMe();
      if (mounted) {
        if (result.ok) {
          setUser(result.data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };
    initializeAuth();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}