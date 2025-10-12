"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Loader2, Mail, ArrowLeft, CheckCircle, Shield, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete 6-digit code"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'success'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    mode: 'onBlur',
    defaultValues: {
      otp: "",
    },
  });

  // Timer countdown
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  async function onEmailSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserEmail(values.email);
      setCurrentStep('otp');
      setTimeLeft(300); // 5 minutes
      toast.success("Verification code sent to your email!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onOTPSubmit(values: OTPFormValues) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate OTP verification
      if (values.otp === "123456") {
        setCurrentStep('success');
        toast.success("Code verified successfully!");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const resendCode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimeLeft(300); // Reset timer
      toast.success("New verification code sent!");
    } catch {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (currentStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto border rounded-lg p-6 bg-card">
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Password Reset Successful</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Account Secured
              </h2>
              <p className="text-sm text-gray-600">
                Your account is now secure with your new password.
              </p>
            </div>

            <Link href="/auth/login">
              <Button className="w-full">
                Continue to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification step
  if (currentStep === 'otp') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto border rounded-lg p-6 bg-card">
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Enter Verification Code</h1>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;ve sent a 6-digit code to <strong>{userEmail}</strong>
            </p>
          </div>

          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
            <div className="space-y-4 mx-auto">
              <div className="text-center">
                <label className="block text-sm font-medium mb-4">
                  Enter the 6-digit code
                </label>
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value);
                    otpForm.setValue('otp', value);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-destructive mt-2">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {timeLeft > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Code expires in <span className="font-medium text-orange-600">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={isLoading || timeLeft > 0}
                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Resend code"}
                  </button>
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep('email')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="inline w-4 h-4 mr-1" />
              Back to email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email input step
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto border rounded-lg p-6 bg-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            No worries! Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;