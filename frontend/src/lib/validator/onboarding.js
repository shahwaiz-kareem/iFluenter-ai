import { z } from "zod";

const onboardingSchema = z.object({
  proficiencyLevel: z.string({
    required_error: "Please select your practice frequency.",
  }),

  theme: z.string({
    required_error: "Please select a theme.",
  }),

  practiceFrequency: z.string({
    required_error: "Please select your practice frequency.",
  }),

  ageRange: z.string({
    required_error: "Please select your age range.",
  }),
  visitSource: z
    .string({
      required_error: "Please select the source which brought you here.",
    })
    .min(1, "Please select at least one item."),
  goals: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one goal.",
  }),
});

export default onboardingSchema;
