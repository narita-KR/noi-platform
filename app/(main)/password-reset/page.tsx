"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Password reset requested for:", email);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-white p-8 shadow-md">
          {/* Back link */}
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted no-underline transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            ログインに戻る
          </Link>

          {/* Heading */}
          <h1 className="mb-4 text-2xl font-bold text-primary-dark">
            パスワードリセット
          </h1>

          {submitted ? (
            /* ===== SUCCESS STATE ===== */
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div className="space-y-2 text-sm text-green-800">
                  <p className="font-semibold">
                    ご入力いただいたメールアドレスに変更メールを送信しました。
                  </p>
                  <p>
                    メールの内容に従ってパスワードのリセットを完了してください。
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted">
                メールが届かない場合は、迷惑メールフォルダをご確認いただくか、再度お試しください。
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-outline w-full px-6 py-2.5 font-medium"
                >
                  再送信する
                </button>
                <Link
                  href="/login"
                  className="btn-primary w-full px-6 py-2.5 font-medium no-underline"
                >
                  ログインに戻る
                </Link>
              </div>
            </div>
          ) : (
            /* ===== FORM STATE ===== */
            <div>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                登録時のメールアドレスを入力して「認証メール送信」ボタンをクリックしてください。ご入力いただいたメールアドレスにパスワードリセット用のメールを送信します。
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="reset-email"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="oooooo@oooooo.oo"
                      className={`w-full rounded-md border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                        error
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-300 focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
                      }`}
                      autoComplete="email"
                    />
                  </div>
                  {error && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-danger w-full px-6 py-3 text-base font-bold"
                >
                  認証メール送信
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
