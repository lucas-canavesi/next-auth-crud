"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { getErrorMessage } from "@/lib/api";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, ErrorMessage, LoadingOverlay } from "@/components/ui";

export function LoginForm() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!email.includes("@")) {
      errors.email = "Email inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email.trim(), password);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingOverlay label="Carregando..." />;
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <ErrorMessage message={error} onDismiss={() => setError("")} dismissible />
              )}

              <Input
                label="Email"
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validate()}
                disabled={loading}
                placeholder="usuario@example.com"
                error={fieldErrors.email}
              />

              <Input
                label="Senha"
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validate()}
                disabled={loading}
                placeholder="••••••••"
                error={fieldErrors.password}
              />

              <Button type="submit" className="w-full" loading={loading} size="md">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}