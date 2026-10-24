import { z } from "zod";
export const envSchema = z.object({
  name: z.string({
    required_error: "Please type something.",
  }),
  desc: z.string({
    required_error: "Desc is required.",
  }),
  url: z.string({
    required_error: "Required",
  }),
  preview: z.string({
    required_error: "Required",
  }),
  isActive: z.boolean({
    required_error: "Required",
  }),
  forTier: z.string({
    required_error: "Required",
  }),
  actModes: z.string({
    required_error: "Please type something.",
  }),
});
