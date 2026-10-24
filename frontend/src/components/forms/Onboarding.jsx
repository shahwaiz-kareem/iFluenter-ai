"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Check,
  User,
  Settings,
  Target,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import onboardingSchema from "@/lib/validator/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUpdateUserMutation } from "@/lib/features/services/userApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const INITIAL_VALUES = {
  proficiencyLevel: "beginner",
  practiceFrequency: "daily",
  goals: ["goal_1"],
  theme: "dark",
  visitSource: "",
  ageRange: "21-30",
};

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: INITIAL_VALUES,
    shouldUnregister: false,
  });

  const router = useRouter();
  const { toast } = useToast();
  const [updateUser] = useUpdateUserMutation();

  const SelectField = ({ name, label, options, placeholder }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const steps = [
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      fields: ["visitSource", "ageRange"],
    },
    {
      title: "Skills",
      icon: <Settings className="h-5 w-5" />,
      fields: ["proficiencyLevel", "practiceFrequency"],
    },
    { title: "Goals", icon: <Target className="h-5 w-5" />, fields: ["goals"] },
    {
      title: "Preferences",
      icon: <Palette className="h-5 w-5" />,
      fields: ["theme"],
    },
  ];

  const goals = [
    { id: "goal_1", label: "Improve speaking skills" },
    { id: "goal_2", label: "Improve vocabulary" },
    { id: "goal_3", label: "Improve fluency and grammar" },
  ];

  const handleNext = async () => {
    const isValid = await form.trigger(steps[currentStep].fields, {
      shouldFocus: true,
    });
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const onSubmit = async (values) => {
    if (currentStep === steps.length - 1) {
      try {
        // console.log("hi");
        const response = await updateUser({
          isOnboarded: true,
          ...values,
        }).unwrap();

        toast({
          description: response.message || "update successful!",
          variant: "outline",
        });
        document.cookie = `isOnboarded=onboarded `;

        if (response.status === "success") {
          router.push("/dashboard");
        }
      } catch (error) {
        toast({
          description: error.data?.message || "Unable to update",
          variant: "destructive",
        });
      }
    } else {
      await handleNext();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const renderButtonLabel = () => {
    return isLastStep ? (
      <>
        Done
        <Check className="h-4 w-4 ml-2" />
      </>
    ) : (
      <>
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </>
    );
  };

  const stepContent = {
    0: (
      <div className="space-y-6">
        <SelectField
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

        <SelectField
          name="visitSource"
          className="p-4"
          label="Visit Source"
          placeholder="Select the source which brought you here"
          options={[
            { value: "Google search", label: "Google search" },
            { value: "Facebook", label: "Facebook" },
            { value: "Youtube", label: "Youtube" },
            { value: "Instagram", label: "Instagram" },
            { value: "Reddit", label: "Reddit" },
            { value: "Discord", label: "Discord" },
            { value: "Chatgpt", label: "Chatgpt" },
            { value: "Advertisements", label: "Advertisements" },
            {
              value: "Recommended by someone",
              label: "Recommended by someone",
            },
            { value: "Other", label: "Other" },
          ]}
        />
      </div>
    ),
    1: (
      <div className="space-y-6">
        <SelectField
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
          name="practiceFrequency"
          className="p-4"
          label="Practice Frequency"
          placeholder="Select practice frequency"
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "randomly", label: "Randomly" },
          ]}
        />
      </div>
    ),
    2: (
      <FormField
        control={form.control}
        name="goals"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Goals</FormLabel>
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
    ),
    3: (
      <SelectField
        name="theme"
        className="p-4"
        label="Theme Preference"
        placeholder="Select theme for app"
        options={[
          { value: "light", label: "☀️ Light" },
          { value: "dark", label: "🌙 Dark" },
        ]}
      />
    ),
  };

  const renderFormStep = () => stepContent[currentStep];

  return (
    <>
      <div className="  w-full">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-sm mt-2">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full mb-2 bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          {renderFormStep()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button type="submit">{renderButtonLabel()}</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Onboarding;
