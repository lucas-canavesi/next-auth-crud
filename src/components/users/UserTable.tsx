"use client";

import { useState } from "react";
import Link from "next/link";
import { getUsers, deleteUser, getErrorMessage } from "@/lib/api";
import type { AuthUser } from "@/types/user";
import { ROUTES } from "@/lib/constants/routes";
import { UserRowActions } from "./UserRowActions";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState, ErrorMessage, LoadingOverlay } from "@/components/ui";

export function UserTable() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await getUsers();
    if (result.ok) {
      setUsers(result.data);
    } else {
      setError(getErrorMessage(result.error));
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const result = await deleteUser(id);
    setDeletingId(null);
    if (result.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      setError(getErrorMessage(result.error));
    }
  };

  if (loading) {
    return <LoadingOverlay label="Carregando usuários..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadUsers}
        retryLabel="Tentar novamente"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h1>
        <Link href={ROUTES.ADMIN_USERS_NEW}>
          <Button>+ Novo usuário</Button>
        </Link>
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="Nenhum usuário encontrado"
          description="Comece criando o primeiro usuário do sistema."
          action={{
            label: "+ Novo usuário",
            onClick: () => {},
            href: ROUTES.ADMIN_USERS_NEW,
          }}
        >
          <Link href={ROUTES.ADMIN_USERS_NEW} className="block">
            <Button variant="primary">+ Novo usuário</Button>
          </Link>
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <UserRowActions
                      user={user}
                      onDelete={handleDelete}
                      deleting={deletingId === user.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DeleteConfirmDialog
            isOpen={deletingId !== null}
            onClose={() => setDeletingId(null)}
            onConfirm={() => deletingId && handleDelete(deletingId)}
            loading={deletingId !== null}
          />
        </Card>
      )}
    </div>
  );
}