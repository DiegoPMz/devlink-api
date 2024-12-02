import z from "zod";

export const loginSchema = z
  .object({
    email: z
      .string({ message: "Please enter a valid email address" })
      .email({ message: "This email address seems to be invalid" }),

    password: z
      .string({ message: "Please enter your password" })
      .trim()
      .min(1, { message: "Password cannot be empty" }),
  })
  .strict({
    message:
      "There seems to be an issue with the information provided. Please double-check",
  });

export const registerSchema = z
  .object({
    email: z
      .string({ message: "Please enter a valid email address" })
      .email({ message: "This email address seems to be invalid" }),

    password: z
      .string({ message: "Please enter your password" })
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" }),

    confirm_password: z
      .string({ message: "Please confirm your password" })
      .trim()
      .min(8, {
        message: "Password confirmation must be at least 8 characters long",
      }),
  })
  .strict({
    message:
      "There seems to be an issue with the information provided. Please double-check",
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match. Please try again",
    path: ["confirm_password"],
  });

export type RegisterAuthType = z.infer<typeof registerSchema>;
export type LoginAuthType = z.infer<typeof loginSchema>;
