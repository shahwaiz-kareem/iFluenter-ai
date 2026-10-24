"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import changePasswordSchema from "@/lib/validator/changePassword";
import { useChangePasswordMutation } from "@/lib/features/services/userApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ChangePassword = () => {
  const { toast } = useToast();
  const [changePassword] = useChangePasswordMutation();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmationPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    console.log("values", values);
    try {
      const response = await changePassword(values).unwrap();

      toast({
        description: response.message || "Login successful!",
        variant: "outline",
      });
    } catch (error) {
      toast({
        description: error?.data?.message || "Unable to login",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-32" type="submit">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-white" />
              Please wait
            </span>
          ) : (
            "Reset"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePassword;
