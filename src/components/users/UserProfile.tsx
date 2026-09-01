"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { updateUser, changePassword } from "@/lib/api";
import type { UpdateUserRequest, ChangePasswordRequest } from "@/types/user";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, ErrorMessage, LoadingOverlay } from "@/components/ui";

export function UserProfile() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<Partial<UpdateUserRequest>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<ChangePasswordRequest>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validateField = (name: string, value: string): string | null => {
    const trimmed = value.trim();
    if (name === "name") {
      if (!trimmed) return "Nome é obrigatório";
      if (trimmed.length < 2) return "Nome deve ter pelo menos 2 caracteres";
    }
    if (name === "email") {
      if (!trimmed) return "Email é obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Email inválido";
    }
    return null;
  };

  const validatePasswordField = (name: string, value: string, allData?: ChangePasswordRequest): string | null => {
    if (name === "currentPassword") {
      if (!value) return "Senha atual é obrigatória";
    }
    if (name === "newPassword") {
      if (!value) return "Nova senha é obrigatória";
      if (value.length < 6) return "Nova senha deve ter pelo menos 6 caracteres";
    }
    if (name === "confirmPassword") {
      if (!value) return "Confirmação é obrigatória";
      if (allData?.newPassword && value !== allData.newPassword) return "As senhas não coincidem";
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));

    const error = validateField(name, normalizedValue);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === "email" ? value.toLowerCase() : value;
    const error = validateField(name, normalizedValue);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    const error = validatePasswordField(name, value, { ...passwordData, [name]: value });
    setPasswordErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handlePasswordBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validatePasswordField(name, value, passwordData);
    setPasswordErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<UpdateUserRequest> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof UpdateUserRequest]);
      if (error) {
        newErrors[key as keyof UpdateUserRequest] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<ChangePasswordRequest> = {};

    (Object.keys(passwordData) as Array<keyof ChangePasswordRequest>).forEach((key) => {
      const error = validatePasswordField(key, passwordData[key], passwordData);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await updateUser(user.id, formData);

      if (result.ok) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso." });
        await refresh();
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
          setMessage({ type: "error", text: "Não foi possível atualizar seu perfil. Tente novamente." });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Não foi possível atualizar seu perfil. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;
    if (!user) return;

    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      const result = await changePassword(passwordData);

      if (result.ok) {
        setPasswordMessage({ type: "success", text: "Senha alterada com sucesso. Você será redirecionado para o login." });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const error = result.error;
        if (error.status === 401) {
          if (error.message === "Current password is incorrect") {
            setPasswordMessage({ type: "error", text: "Senha atual incorreta." });
            setPasswordErrors({ currentPassword: "Senha atual incorreta." });
          } else {
            setPasswordMessage({ type: "error", text: "Sessão expirada. Faça login novamente." });
          }
        } else if (error.status === 400) {
          setPasswordMessage({ type: "error", text: error.message || "Dados inválidos." });
        } else if (error.status === 404) {
          setPasswordMessage({ type: "error", text: "Usuário não encontrado." });
        } else {
          setPasswordMessage({ type: "error", text: "Não foi possível alterar a senha. Tente novamente." });
        }
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Não foi possível alterar a senha. Tente novamente." });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <LoadingOverlay label="Carregando perfil..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Gerencie suas informações pessoais.
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
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais abaixo.</CardDescription>
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
              error={errors.email}
            />

            <div>
              <Label>Função</Label>
              <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "destructive"
                      : "success"
                  }
                >
                  {user.role}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A função não pode ser alterada.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" className="w-full sm:w-auto" loading={loading}>
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {passwordMessage && (
        <ErrorMessage
          title={passwordMessage.type === "success" ? "Sucesso" : "Erro"}
          message={passwordMessage.text}
          onDismiss={() => setPasswordMessage(null)}
          dismissible
        />
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Trocar Senha</CardTitle>
            <CardDescription>Altere sua senha atual. Você será desconectado após a alteração.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              disabled={passwordLoading}
              error={passwordErrors.currentPassword}
            />

            <Input
              label="Nova Senha"
              type="password"
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              disabled={passwordLoading}
              error={passwordErrors.newPassword}
              hint="Mínimo 6 caracteres"
            />

            <Input
              label="Confirmar Nova Senha"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              disabled={passwordLoading}
              error={passwordErrors.confirmPassword}
            />

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" className="w-full sm:w-auto" loading={passwordLoading}>
                Alterar senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}