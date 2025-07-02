"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginAuth, loginSchema } from "@/types/auth";
import { AuthPage } from "../component/AuthPage";
import { PasswordInput } from "@/components/custom/passwordInput";
import { useLoginMutation } from "../component/server";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
    const {mutate}  = useLoginMutation()
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<loginAuth>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: loginAuth) {
    setIsLoading(true);
    setLoginError(null);

    try {
      mutate(data)
    } catch (error) {
      setLoginError("Terjadi Kesalahan ");
    } finally {
      setIsLoading(false);
      reset();
    }
  }

  return (
    <AuthPage>
      <form className="space-y-4 text-white" onSubmit={handleSubmit(onSubmit)}>
        {loginError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
            {loginError}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Username ">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="
              Masukkan
              username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-white hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </div>

        <div className="text-center text-sm">
          Belum Punya Account?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
