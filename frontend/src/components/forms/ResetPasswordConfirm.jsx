"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import resetPasswordConfirmSchema from "@/lib/validator/resetPasswordConfirm";
import { useResetPasswordConfirmMutation } from "@/lib/features/services/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function ResetPasswordConfirm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      password: "",
      confirmationPassword: "",
    },
  });
  const router = useRouter();

  const params = useSearchParams();
  const _id = params.get("_id");
  const token = params.get("token");
  const [resetPasswordConfirm] = useResetPasswordConfirmMutation();

  const { toast } = useToast();

  useLayoutEffect(() => {
    if (!_id || !token) router.push("/sign-in");
  }, []);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    try {
      const response = await resetPasswordConfirm({
        body: values,
        _id,
        token,
      }).unwrap();

      toast({
        description:
          response.message || "Your password has been reset successfully!",
        variant: "outline",
      });

      if (response.status === "success") {
        router.push("/sign-in");
      }
    } catch (error) {
      toast({
        description: error.data?.message || "Unable to proceed",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmationPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <Button className="w-full" type="submit">
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-white" />
                Please wait
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
