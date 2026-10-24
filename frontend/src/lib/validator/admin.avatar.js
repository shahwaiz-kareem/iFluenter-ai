import { z } from "zod";
export const avatarSchema = z.object({
  name: z.string({
    required_error: "Please type something.",
  }),
  gender: z.string({
    required_error: "Required",
  }),
  bio: z.string({
    required_error: "Bio is required.",
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
