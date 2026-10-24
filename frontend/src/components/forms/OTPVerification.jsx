"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import otpVerificationSchema from "@/lib/validator/otpVerification";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "@/lib/features/services/userApi";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export function OtpVerification() {
  const form = useForm({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();

  const [isResend, setIsResend] = useState(false);
  const [resendText, setResendText] = useState("Resend");
  const [resendTimer, setResendTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (resendTimer) {
        clearInterval(resendTimer);
      }
    };
  }, [resendTimer]);

  async function onSubmit(data) {
    try {
      const response = await verifyEmail({
        ...data,
      }).unwrap();

      toast({
        description: response.message || "Email verified successfully!",
        variant: "outline",
      });

      if (response.status === "success") {
        router.push(response.redirect || "/dashboard");
      }
    } catch (error) {
      toast({
        description:
          error.data?.message || "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle resend OTP request
  async function resendRequest() {
    try {
      setIsResend(true);
      setResendText("...Processing");

      const response = await resendOtp().unwrap();

      toast({
        description:
          response.message ||
          "A new OTP has been sent to your email, please check your email.",
        variant: "outline",
      });

      let count = 40;
      const interval = setInterval(() => {
        count -= 1;
        setResendText(`Resend (${count})`);

        if (count === 0) {
          clearInterval(interval);
          setIsResend(false);
          setResendText("Resend");
        }
      }, 1000);

      setResendTimer(interval);
    } catch (error) {
      toast({
        description:
          error.data?.message || "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
      setIsResend(false);
      setResendText("Resend");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  maxLength={6}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-center text-sm">
                Enter your one-time password, sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between mt-3">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Verify OTP
          </Button>

          <Button
            className="font-semibold underline"
            variant="link"
            disabled={isResend}
            onClick={resendRequest}
          >
            {resendText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
