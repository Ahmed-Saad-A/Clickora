"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useApiService } from "@/hooks";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { RegisterSchema } from "@/components";



type RegisterFormValues = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const apiService = useApiService();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      name: "Ahmed Saad",
      email: "ahmed.lab505@gmail.com",
      password: "Ahmed@123",
      rePassword: "Ahmed@123",
      phone: "01025363285",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      const res = await apiService.signUp(
        values.name,
        values.email,
        values.password,
        values.rePassword,
        values.phone
      );

      if (res?.message === "success") {
        toast.success("Account created successfully. Please sign in.");
        router.push("/auth/login");
      } else {
        toast.error(res?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.log("🚀 ~ onSubmit ~ err:", err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto border rounded-lg p-6 bg-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join us and start shopping today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rePassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="rePassword"
                type={showRePassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                {...register("rePassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground"
                onClick={() => setShowRePassword((v) => !v)}
                aria-label={showRePassword ? "Hide password" : "Show password"}
              >
                {showRePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.rePassword && (
              <p className="text-sm text-destructive mt-1">{errors.rePassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+201234567890"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;