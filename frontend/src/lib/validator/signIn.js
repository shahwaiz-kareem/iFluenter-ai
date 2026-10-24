import { z } from "zod";

const signInFormSchema = z.object({
  email: z.string().email(2, {
    message: "email must be a valid email.",
  }),
  password: z.string(),
});

export default signInFormSchema;
