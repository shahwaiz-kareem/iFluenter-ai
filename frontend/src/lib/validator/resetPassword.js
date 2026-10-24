import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email(2, {
    message: "email must be a valid email.",
  }),
});

export default resetPasswordSchema;
