"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function PaymentConfirmRedirect() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("counting");
  const [retryCount, setRetryCount] = useState(0);

  const router = useRouter();
  const MAX_RETRIES = 5;
  const REDIRECT_TIME = 5000;
  const SUPPORT_EMAIL =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";

  useEffect(() => {
    const interval = 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + (interval / REDIRECT_TIME) * 100;
      });
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && status === "counting") {
      setStatus("verifying");
    }
  }, [progress, status]);

  useEffect(() => {
    if (status !== "verifying") return;

    const attemptVerification = async () => {
      try {
        const res = await fetch(`/api/user/profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.user && !data.user.subscriptionExpired) {
          router.push("/dashboard");
        } else {
          if (!res.ok && res.status === 401) {
            router.push("/sign-in");
          }
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, 2000); // Wait 2 seconds before next attempt
          } else {
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("error");
      }
    };

    attemptVerification();
  }, [status, retryCount, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-colors duration-500 bg-white shadow-sm border border-slate-100">
            {status === "error" ? (
              <AlertCircle className="h-12 w-12 text-destructive animate-in zoom-in" />
            ) : (
              <CheckCircle2 className="h-12 w-12 text-green-600 animate-in zoom-in" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-primary-foreground/80">
            {status === "error"
              ? "Verification Pending"
              : "Payment Successful!"}
          </CardTitle>
          <p className="text-sm text-primary-foreground/60 mt-2 px-6">
            {status === "error"
              ? "We've received your payment, but your account hasn't updated yet. Don't worry, this usually takes a minute."
              : "Hang tight while we activate your premium features."}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {status !== "error" ? (
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-tighter">
                <span>
                  {status === "verifying"
                    ? `Verifying (Attempt ${retryCount + 1}/${
                        MAX_RETRIES + 1
                      })...`
                    : "Redirecting shortly..."}
                </span>
                {status === "verifying" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900">
                    Need help?
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    If your dashboard doesn't load within a few minutes, please
                    reach out to us:
                  </p>
                  <p className="text-sm font-bold text-amber-900 underline underline-offset-4 decoration-amber-300">
                    {SUPPORT_EMAIL}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              className="w-full"
              variant={status === "error" ? "outline" : "default"}
              onClick={() => {
                if (status === "error") {
                  window.location.reload();
                } else {
                  router.push("/dashboard");
                }
              }}
              disabled={status === "verifying"}
            >
              {status === "error" ? "Retry Now" : "Go to Dashboard"}
              {status !== "verifying" && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
