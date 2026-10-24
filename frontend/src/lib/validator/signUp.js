import { z } from "zod";

const passwordValidation = (password) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?,:'"></#.(){}_^&]/.test(password);

  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
};

const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "name must be at least 3 characters.",
      })
      .max(30),
    email: z.string().email(2, {
      message: "email must be a valid email.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128),
    confirmationPassword: z.string().min(1, "confirmation password required"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmationPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmationPassword"],
    }
  )
  .refine(
    (values) => {
      return passwordValidation(values.password);
    },
    {
      message:
        "Password must contain at least one small letter (a-z), one capital letter (A-Z), one number (0-9), and one special symbol (like @, $, or &).",
      path: ["password"],
    }
  );

export default signUpFormSchema;
