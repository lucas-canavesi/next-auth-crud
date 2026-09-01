"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Bem-vindo ao painel principal do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
              <dd className="mt-1 text-gray-900 dark:text-white">{user?.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="mt-1 text-gray-900 dark:text-white">{user?.email}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</dt>
              <dd className="mt-1 text-gray-900 dark:text-white font-mono">{user?.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Acesso</dt>
              <dd className="mt-1">
                <Badge variant={user?.role === "ADMIN" ? "destructive" : "success"}>
                  {user?.role}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navegação</CardTitle>
          <CardDescription>Use o menu lateral para acessar as funcionalidades disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• <strong>Dashboard</strong> — Visão geral (esta página)</li>
            <li>• <strong>Perfil</strong> — Visualizar e editar seus dados</li>
            {user?.role === "ADMIN" && (
              <li>• <strong>Usuários</strong> — Gerenciar usuários do sistema (ADMIN)</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}