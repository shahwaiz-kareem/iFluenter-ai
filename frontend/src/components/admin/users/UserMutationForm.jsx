"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useUpdateUserMutation } from "@/lib/features/services/admin/userApi.admin";
import { useToast } from "@/hooks/use-toast";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { userSchema } from "@/lib/validator/admin.user";
import { SelectField } from "@/components/shared/SelectField";

export default function UserMutationForm({
  selectedUser,
  users,
  setUsers,
  setUserId,
}) {
  const { toast } = useToast();
  const [updateUser] = useUpdateUserMutation();

  const initialValues = {
    name: selectedUser?.name,
    proficiencyLevel: selectedUser?.proficiencyLevel,
    practiceFrequency: selectedUser?.practiceFrequency,
    goals: selectedUser?.goals,
    ageRange: selectedUser?.ageRange,
    nativeLanguage: selectedUser?.nativeLanguage,
    isOnboarded: selectedUser?.isOnboarded,
    isVerified: selectedUser?.isVerified,
    isSuspended: selectedUser?.isSuspended,
    subscriptionStatus: selectedUser?.subscriptionStatus,
  };

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues,
  });
  const goals = [
    { id: "goal_1", label: "Improve speaking skills" },
    { id: "goal_2", label: "Improve vocabulary" },
    { id: "goal_3", label: "Improve fluency and grammar" },
  ];

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    try {
      const response = await updateUser({
        userId: selectedUser.id,
        ...values,
      }).unwrap();
      if (response.status !== "success")
        throw new Error(response.message || "Operation Failed");

      const updateIndex = users.findIndex((e) => e.id === selectedUser.id);
      if (updateIndex === -1) return;
      const newUsers = users;
      newUsers[updateIndex] = { ...selectedUser, ...response.user };
      delete newUsers[updateIndex]._id;
      setUsers(newUsers);
      setUserId("");
      toast({
        description:
          response?.message || "users settings have been applied successfully!",
        variant: "outline",
      });
    } catch (error) {
      toast({
        description: error.message || "Something went wrong!",
        variant: "destructive",
      });
    }
  };
  // console.log(form.getValues());
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="my-2">
            <SelectField
              control={form.control}
              form={form}
              name="ageRange"
              className="p-4"
              label="Age Range"
              placeholder="Select your age range"
              options={[
                { value: "10-15", label: "10-15" },
                { value: "16-20", label: "16-20" },
                { value: "21-30", label: "21-30" },
                { value: "31-40", label: "31-40" },
                { value: "41-50", label: "41-50" },
                { value: "50+", label: "50+" },
              ]}
            />
          </div>
          <div className="my-2 flex flex-col gap-2">
            <SelectField
              control={form.control}
              form={form}
              name="proficiencyLevel"
              className="p-4"
              label="proficiency Level"
              placeholder="Select current speaking skill proficiencyLevel"
              options={[
                { value: "beginner", label: "🌱 Beginner" },
                { value: "intermediate", label: "📚 Intermediate" },
                { value: "advance", label: "⭐ Advanced" },
              ]}
            />
            <SelectField
              control={form.control}
              form={form}
              name="practiceFrequency"
              className="p-4 my-2"
              label="Practice Frequency"
              placeholder="Select practice frequency"
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "randomly", label: "Randomly" },
              ]}
            />
          </div>
          <FormField
            control={form.control}
            name="goals"
            render={() => (
              <FormItem>
                <div className="my-2">
                  <FormLabel className="">Goals</FormLabel>
                  <FormDescription>
                    Select the goals you want to achieve.
                  </FormDescription>
                </div>
                {goals.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="goals"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nativeLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Native language</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter native language"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={form.watch("nativeLanguage")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-2">
            <SelectField
              control={form.control}
              form={form}
              name="isOnboarded"
              className="p-4"
              label="User onboarded"
              placeholder="Select onboarding"
              options={[
                { value: true, label: "onboarded" },
                { value: false, label: "Not onboarded" },
              ]}
            />
          </div>
          <div className="my-2">
            <SelectField
              control={form.control}
              form={form}
              name="isVerified"
              className="p-4"
              label="User verified"
              placeholder="Select verified status"
              options={[
                { value: true, label: "Verified" },
                { value: false, label: "Not Verified" },
              ]}
            />
          </div>

          <div className="my-2">
            <SelectField
              control={form.control}
              form={form}
              name="isSuspended"
              className="p-4"
              label="Suspend"
              placeholder="user's suspended status"
              options={[
                { value: true, label: "Suspended" },
                { value: false, label: "Not Suspended" },
              ]}
            />
          </div>
          <div className="my-2">
            <SelectField
              control={form.control}
              form={form}
              name="subscriptionStatus"
              className="p-4"
              label="Subscription Status"
              placeholder="user's subscription status"
              options={[
                { value: "free", label: "Free" },
                { value: "active", label: "Active" },
                { value: "cancelled", label: "Cancelled" },
                { value: "unpaid", label: "Unpaid" },
                { value: "paused", label: "Paused" },
              ]}
            />
          </div>
        </div>
        <Button className="w-full md:w-32" type="submit">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary" />
              Please wait
            </span>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}
