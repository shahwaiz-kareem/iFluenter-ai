import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  proficiencyLevel: z.string({
    required_error: "Please select your practice frequency.",
  }),

  practiceFrequency: z.string({
    required_error: "Please select your practice frequency.",
  }),

  ageRange: z.string({
    required_error: "Please select your age range.",
  }),

  goals: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one goal.",
  }),
});
