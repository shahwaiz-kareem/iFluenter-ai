"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useUpdateUserMutation } from "@/lib/features/services/userApi";
import { useToast } from "@/hooks/use-toast";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { profileSchema } from "@/lib/validator/account";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { SelectField } from "../shared/SelectField";
import { userContext } from "@/context/UserProvider";
import { useContext } from "react";
export default function ProfileTab() {
  const { toast } = useToast();
  const [updateUser] = useUpdateUserMutation();

  const { userData, setUserData } = useContext(userContext);
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name,
      proficiencyLevel: userData?.proficiencyLevel,
      practiceFrequency: userData?.practiceFrequency,
      goals: userData?.goals,
      ageRange: userData?.ageRange,
    },
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
      const response = await updateUser(values).unwrap();
      if (response.status === "success") {
        toast({
          description:
            response?.message || "your profile has been modified successfully!",
          variant: "outline",
        });
        setUserData((prev) => ({ ...prev, ...response?.user }));
      } else {
        toast({
          description: error.data?.message || "Unable to apply your changes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: error.data?.message || "Unable to apply your changes",
        variant: "destructive",
      });
    }
  };

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
        </div>
        <Button className="w-full md:w-32" type="submit">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-white" />
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
