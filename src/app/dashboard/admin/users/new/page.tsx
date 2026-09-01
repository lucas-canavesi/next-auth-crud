import { Metadata } from "next";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { UserForm } from "@/components/users/UserForm";

export const metadata: Metadata = {
  title: "Novo Usuário",
  description: "Criar um novo usuário no sistema",
};

export default function NewUserPage() {
  return (
    <AdminGuard>
      <UserForm />
    </AdminGuard>
  );
}