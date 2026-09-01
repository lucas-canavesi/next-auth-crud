"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button, Card, CardContent } from "@/components/ui";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  children?: ReactNode;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, loading, children }: DeleteConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Focus the cancel button when dialog opens
    cancelButtonRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />
        <Card className="relative w-full max-w-md shadow-xl">
          <CardContent className="p-6">
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Excluir usuário?
            </h2>
            <p id="delete-dialog-description" className="text-gray-600 dark:text-gray-400 mb-6">
              {children || "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                ref={cancelButtonRef}
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
                disabled={loading}
                loading={loading}
              >
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(dialogContent, document.body);
  }

  return null;
}