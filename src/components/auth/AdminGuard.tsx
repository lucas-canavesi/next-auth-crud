"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, isAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ?? null;
  }

  if (!isAdmin) {
    return fallback ?? null;
  }

  return <>{children}</>;
}