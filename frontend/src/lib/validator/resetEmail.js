import { z } from "zod";

const resetEmailSchema = z.object({
  email: z.string().email(2, {
    message: "email must be a valid email.",
  }),
});

export default resetEmailSchema;
