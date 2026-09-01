"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/lib/api";
import type { CreateUserRequest, UpdateUserRequest } from "@/types/user";
import { ROUTES } from "@/lib/constants/routes";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, ErrorMessage } from "@/components/ui";

interface UserFormProps {
  initialData?: {
    id: number;
    name: string;
    email: string;
  };
  onSuccess?: () => void;
}

type FormData = CreateUserRequest;

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validateField = (name: keyof FormData, value: string): string | null => {
    const trimmed = value.trim();
    if (name === "name") {
      if (!trimmed) return "Nome é obrigatório";
      if (trimmed.length < 2) return "Nome deve ter pelo menos 2 caracteres";
    }
    if (name === "email") {
      if (!trimmed) return "Email é obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Email inválido";
    }
    if (name === "password") {
      if (!isEditing) {
        if (!trimmed) return "Senha é obrigatória";
        if (trimmed.length < 6) return "Senha deve ter pelo menos 6 caracteres";
      }
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));

    const error = validateField(name as keyof FormData, normalizedValue);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === "email" ? value.toLowerCase() : value;
    const error = validateField(name as keyof FormData, normalizedValue);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<FormData> = {};

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      let result;
      if (isEditing && initialData) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
        };
        result = await updateUser(initialData.id, updateData);
      } else {
        result = await createUser(formData);
      }

      if (result.ok) {
        setMessage({ type: "success", text: isEditing ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso." });
        if (onSuccess) {
          onSuccess();
        } else {
          setTimeout(() => router.push(ROUTES.ADMIN_USERS), 1000);
        }
      } else {
        const error = result.error;
        if (error.status === 401) {
          setMessage({ type: "error", text: "Sessão expirada. Faça login novamente." });
        } else if (error.status === 403) {
          setMessage({ type: "error", text: "Você não tem permissão para realizar esta ação." });
        } else if (error.status === 409) {
          setMessage({ type: "error", text: "Este email já está cadastrado." });
        } else if (error.status === 404) {
          setMessage({ type: "error", text: "Usuário não encontrado." });
        } else if (error.status === 400) {
          setMessage({ type: "error", text: error.message || "Dados inválidos." });
        } else {
          setMessage({ type: "error", text: "Não foi possível concluir a operação. Tente novamente." });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Não foi possível concluir a operação. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {isEditing ? "Atualize as informações do usuário." : "Preencha os dados para criar um novo usuário."}
        </p>
      </div>

      {message && (
        <ErrorMessage
          title={message.type === "success" ? "Sucesso" : "Erro"}
          message={message.text}
          onDismiss={() => setMessage(null)}
          dismissible
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Informações do Usuário" : "Dados do Usuário"}</CardTitle>
            <CardDescription>
              {isEditing ? "Atualize as informações abaixo." : "Preencha os campos para criar um novo usuário."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nome"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              autoComplete="name"
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              autoComplete="email"
              error={errors.email}
            />

            {!isEditing && (
              <Input
                label="Senha"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="new-password"
                error={errors.password}
                hint="Mínimo 6 caracteres"
              />
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <Button type="submit" loading={loading}>
                {isEditing ? "Salvar alterações" : "Criar usuário"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}