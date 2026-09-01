"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { getUsers, getErrorMessage } from "@/lib/api";
import { UserForm } from "@/components/users/UserForm";
import type { AuthUser } from "@/types/user";
import { ROUTES } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";
import { LoadingOverlay, ErrorMessage } from "@/components/ui";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const result = await getUsers();
      if (result.ok) {
        const foundUser = result.data.find((u) => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError("Usuário não encontrado.");
          setTimeout(() => router.push(ROUTES.ADMIN_USERS), 2000);
        }
      } else {
        setError(getErrorMessage(result.error));
      }
      setLoading(false);
    };
    loadUser();
  }, [userId, router]);

  if (loading) {
    return (
      <AdminGuard>
        <LoadingOverlay label="Carregando usuário..." />
      </AdminGuard>
    );
  }

  if (error || !user) {
    return (
      <AdminGuard>
        <ErrorMessage
          message={error || "Usuário não encontrado."}
          onRetry={() => router.push(ROUTES.ADMIN_USERS)}
          retryLabel="Voltar para a lista"
          dismissible={false}
        />
      </AdminGuard>
    );
  }

  const handleSuccess = () => {
    router.push(ROUTES.ADMIN_USERS);
  };

  return (
    <AdminGuard>
      <UserForm initialData={user} onSuccess={handleSuccess} />
    </AdminGuard>
  );
}