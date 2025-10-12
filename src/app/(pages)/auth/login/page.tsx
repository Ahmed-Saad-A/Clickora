"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): boolean {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return false;
    }

    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (trimmedPassword.length <= 7) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });


      // Basic success heuristic: presence of a token/message/status ok
      if (res?.ok) {
        toast.success("Logged in successfully!");
        router.push("/");
      }
      else{
        toast.error("Invalid email or password.");
        setError("Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto border rounded-lg p-6 bg-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="current-password"
              required
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
          </div>

          {error && (
            <div className="text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogIn className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Don&apos;t have any account <Link href="/auth/register" className="text-primary underline">create account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;