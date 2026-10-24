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
import resetPasswordSchema from "@/lib/validator/resetPassword";
import { useSendUserResetLinkMutation } from "@/lib/features/services/userApi";

export function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;
  const [sendUserEmailLink] = useSendUserResetLinkMutation();
  const { toast } = useToast();

  const onSubmit = async (values) => {
    try {
      const response = await sendUserEmailLink(values).unwrap();
      toast({
        description:
          response.message ||
          "We've sent reset link to your account, please check your email!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: error.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter you email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button className="w-full" type="submit">
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-white" />
                Please wait
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
