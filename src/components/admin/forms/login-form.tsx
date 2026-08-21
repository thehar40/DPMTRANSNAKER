"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, LogIn, UserRound } from "lucide-react";
import { FieldError, Input, Label } from "@/components/ui/fields";
import { loginSchema } from "@/lib/validation";
import { Logo } from "@/components/logo/logo";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      const next: { username?: string; password?: string } = {};
      for (const issue of parsed.error.errors) {
        const key = issue.path[0] as "username" | "password";
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data?.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }
      toast.success("Login berhasil. Selamat datang!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setServerError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="flex flex-col items-center text-center">
            <Logo
              shortName="DPMPTTK Aceh Utara"
              subtitle="Panel Admin"
              imageClassName="h-16 w-16"
            />
            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Masuk Panel Admin
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan username dan password untuk mengelola konten website.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {serverError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {serverError}
              </div>
            ) : null}

            <div>
              <Label htmlFor="username" required>
                Username
              </Label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="!pl-9"
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <FieldError>{errors.username}</FieldError>
            </div>

            <div>
              <Label htmlFor="password" required>
                Password
              </Label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!pl-9"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <FieldError>{errors.password}</FieldError>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Hanya petugas berwenang yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>
    </div>
  );
}
