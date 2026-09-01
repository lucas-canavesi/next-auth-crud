"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui";

interface UserRowActionsProps {
  user: { id: number; name: string; email: string };
  onDelete: (id: number) => void;
  deleting: boolean;
}

export function UserRowActions({ user, onDelete, deleting }: UserRowActionsProps) {
  const handleDelete = () => {
    onDelete(user.id);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={ROUTES.ADMIN_USERS_EDIT(user.id)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
        aria-label={`Editar ${user.name}`}
      >
        Editar
      </Link>
      <Button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        variant="destructive"
        size="sm"
        aria-label={`Excluir ${user.name}`}
      >
        {deleting ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );
}