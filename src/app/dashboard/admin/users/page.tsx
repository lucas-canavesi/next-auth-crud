import { Metadata } from "next";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { UserTable } from "@/components/users/UserTable";

export const metadata: Metadata = {
  title: "Gerenciar Usuários",
  description: "Administração de usuários do sistema",
};

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <UserTable />
    </AdminGuard>
  );
}