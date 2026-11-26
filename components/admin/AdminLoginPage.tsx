"use client";

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

// The server decides: /api/admin/auth/login checks the password and sets an HttpOnly session cookie.
export default function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        onLoginSuccess();
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.error || "Sign in failed.");
    } catch {
      setError("Could not reach the server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4 selection:bg-[#B85C43]/20">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A88752]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-14 rounded-2xl bg-gradient-to-br from-[#1E211F] to-[#27344A] text-white items-center justify-center shadow-xl border border-[#A88752]/40 mb-2">
            <Sparkles className="size-7 text-[#A88752]" />
          </div>
          <h1 className="font-serif-editorial text-3xl font-bold text-[#1E211F] tracking-wider">
            VISART
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#A88752] font-semibold">
            Executive Admin & CMS Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#D8D0C4] shadow-xl space-y-6">
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68655F] hover:text-[#1E211F]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
                <AlertCircle className="size-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#B85C43] hover:bg-[#9E4730] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        {/* Back to Public Studio */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-[#68655F] hover:text-[#1E211F] underline transition-colors"
          >
            ← Return to VISART Public Craft Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
