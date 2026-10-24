import { z } from "zod";

const otpVerificationSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default otpVerificationSchema;
