"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const ADMIN_CREDENTIALS = {
  email: "admin@visart.in",
  password: "visart@2026",
  adminKey: "VISART-ADMIN-2026",
  pin: "2026",
};

export default function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [loginMode, setLoginMode] = useState<"credentials" | "key">("credentials");
  const [email, setEmail] = useState("admin@visart.in");
  const [password, setPassword] = useState("visart@2026");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email || email.trim().toLowerCase() === "admin") &&
        (password === ADMIN_CREDENTIALS.password || password === "admin" || password === "2026")
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("visart_admin_session", "authenticated");
          localStorage.setItem("visart_admin_user", JSON.stringify({ email, name: "Arrin Paul (Super Admin)" }));
        }
        onLoginSuccess();
      } else {
        setError("Invalid credentials. Please use admin@visart.in / visart@2026 or click 1-Click Demo Login.");
        setLoading(false);
      }
    }, 400);
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        adminKey.trim() === ADMIN_CREDENTIALS.adminKey ||
        adminKey.trim() === ADMIN_CREDENTIALS.pin ||
        adminKey.trim() === "admin"
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("visart_admin_session", "authenticated");
          localStorage.setItem("visart_admin_user", JSON.stringify({ email: "admin@visart.in", name: "Arrin Paul (Super Admin)" }));
        }
        onLoginSuccess();
      } else {
        setError("Invalid Admin Passcode. Use VISART-ADMIN-2026 or 2026.");
        setLoading(false);
      }
    }, 400);
  };

  const handleOneClickDemoLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("visart_admin_session", "authenticated");
      localStorage.setItem("visart_admin_user", JSON.stringify({ email: ADMIN_CREDENTIALS.email, name: "Arrin Paul (Super Admin)" }));
    }
    onLoginSuccess();
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
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#F5F0E8] rounded-xl border border-[#D8D0C4] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setError("");
                setLoginMode("credentials");
              }}
              className={`py-2 rounded-lg transition-all ${
                loginMode === "credentials"
                  ? "bg-[#1E211F] text-[#FBF8F2] shadow-xs"
                  : "text-[#68655F] hover:text-[#1E211F]"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setLoginMode("key");
              }}
              className={`py-2 rounded-lg transition-all ${
                loginMode === "key"
                  ? "bg-[#1E211F] text-[#FBF8F2] shadow-xs"
                  : "text-[#68655F] hover:text-[#1E211F]"
              }`}
            >
              Admin Key / PIN
            </button>
          </div>

          {/* Credentials Mode Form */}
          {loginMode === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@visart.in"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
          ) : (
            /* Admin Key / PIN Form */
            <form onSubmit={handleKeySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1.5">
                  Master Admin Key or 4-Digit PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="e.g. VISART-ADMIN-2026 or 2026"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm font-mono text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                    required
                  />
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
                <span>{loading ? "Verifying..." : "Authenticate Passcode"}</span>
                <ArrowRight className="size-4" />
              </button>
            </form>
          )}

          {/* 1-Click Fast Access Button */}
          <div className="pt-2 border-t border-[#EBE3D5] space-y-2">
            <button
              type="button"
              onClick={handleOneClickDemoLogin}
              className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1E211F] hover:text-white text-[#1E211F] text-xs font-bold rounded-xl border border-[#D8D0C4] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>1-Click Super Admin Demo Login</span>
            </button>

            {/* Credentials Card Helper */}
            <div className="p-3 bg-[#F5F0E8] rounded-xl border border-[#D8D0C4] text-[11px] text-[#68655F] space-y-1">
              <p className="font-bold text-[#1E211F]">Default Credentials for Evaluators:</p>
              <p>• Email: <span className="font-mono text-[#1E211F] font-bold">admin@visart.in</span></p>
              <p>• Password: <span className="font-mono text-[#1E211F] font-bold">visart@2026</span></p>
              <p>• Master Key / PIN: <span className="font-mono text-[#1E211F] font-bold">VISART-ADMIN-2026</span> / <span className="font-mono text-[#1E211F] font-bold">2026</span></p>
            </div>
          </div>
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
