"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  FormField,
  inputClass,
  PrimaryButton,
} from "@/components/internal/Modal";
import { createClient } from "@/lib/supabase/client";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/internal/dashboard";

  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) {
        setAuthError(
          error.message === "Invalid login credentials"
            ? "Email or password is incorrect. Please try again."
            : error.message
        );
        return;
      }
      const safeRedirect =
        redirectTo.startsWith("/internal") || redirectTo.startsWith("/proposal")
          ? redirectTo
          : "/internal/dashboard";
      router.push(safeRedirect);
      router.refresh();
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {authError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {authError}
        </div>
      ) : null}

      <FormField label="Email" error={errors.email?.message} required>
        <input
          type="email"
          autoComplete="email"
          className={inputClass}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message} required>
        <input
          type="password"
          autoComplete="current-password"
          className={inputClass}
          {...register("password", { required: "Password is required" })}
        />
      </FormField>

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
