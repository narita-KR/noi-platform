"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!password) {
      newErrors.password = "パスワードを入力してください";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Login submitted:", { email, password, rememberMe });
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ===== LOGIN CARD ===== */}
        <div className="rounded-lg border border-border bg-white p-8 shadow-md">
          {/* A. HEADING */}
          <h1 className="mb-8 text-center text-2xl font-bold text-primary-dark">
            ログイン
          </h1>

          {/* B. FORM */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="oooooo@oooooo.oo"
                  className={`w-full rounded-md border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                パスワード
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="oooooooooooooooo"
                  className={`w-full rounded-md border py-2.5 pl-10 pr-12 text-sm outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={
                    showPassword ? "パスワードを非表示" : "パスワードを表示"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <span className="text-sm text-gray-600">
                次回から自動的にログイン
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full px-6 py-3 text-base font-bold"
            >
              ログイン
            </button>
          </form>

          {/* C. LINKS */}
          <div className="mt-6 space-y-2 text-center">
            <p>
              <Link
                href="/password-reset"
                className="text-sm text-primary-light no-underline hover:underline"
              >
                パスワードをお忘れの方はこちら
              </Link>
            </p>
            <p>
              <Link
                href="/inquiry"
                className="text-sm text-muted no-underline hover:underline"
              >
                ログインできない方はこちら
              </Link>
            </p>
          </div>

          {/* D. SEPARATOR */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm font-semibold text-gray-500">
                初めての方はこちら
              </span>
            </div>
          </div>

          {/* E. REGISTRATION BUTTON */}
          <Link
            href="/register"
            className="btn-danger w-full px-6 py-3 text-base font-bold no-underline"
          >
            無料会員登録
          </Link>
        </div>
      </div>
    </div>
  );
}
