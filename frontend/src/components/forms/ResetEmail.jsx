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
import resetEmailSchema from "@/lib/validator/resetEmail";
import { useResetEmailMutation } from "@/lib/features/services/userApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const ResetEmail = ({ userData }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [resetEmail] = useResetEmailMutation();
  console.log(userData);
  const form = useForm({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: userData?.email || "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    try {
      const response = await resetEmail(values).unwrap();

      toast({
        description: response.message || "Email has been temporarily reset!",
        variant: "outline",
      });
      if (response.status === "success") {
        router.push(`/account/verify-email`);
      }
    } catch (error) {
      toast({
        description: error.data?.message || "Unable to  reset!",
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
              <FormLabel>New Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter new email address"
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

export default ResetEmail;
