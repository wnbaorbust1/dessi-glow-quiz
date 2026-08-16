"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}
    >
      <div
        className="w-full max-w-sm rounded-md p-8"
        style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.25)" }}
      >
        <div className="mb-6 text-center">
          <Lock size={24} style={{ color: "#c6a06b", margin: "0 auto 12px" }} />
          <h1 className="font-serif text-2xl" style={{ color: "#f3e3d5" }}>Admin Login</h1>
          <p className="mt-1 text-xs" style={{ color: "#8a7a6e" }}>Dessi Dollhouse Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            required
            className="w-full rounded-sm px-4 py-3 text-sm"
            style={{
              background: "rgba(20,20,20,0.9)",
              border: "1px solid rgba(198,160,107,0.25)",
              color: "#f3e3d5",
              outline: "none",
            }}
          />

          {error && (
            <p className="text-xs" style={{ color: "#b3453d" }} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm py-3 text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #c17e6c 0%, #a8604e 100%)",
              color: "#f3e3d5",
              letterSpacing: "0.12em",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
