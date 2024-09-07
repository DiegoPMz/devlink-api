import z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .email({ message: "Invalid email" }),

  password: z
    .string({ message: "Password must be a string" })
    .trim()
    .min(1, { message: "Password can't be empty" }),
});

export const registerSchema = z
  .object({
    email: z
      .string({ message: "Email must be a string" })
      .email({ message: "Invalid email" }),

    password: z
      .string({ message: "Password must be a string" })
      .trim()
      .min(1, { message: "Password can't be empty" }),

    confirm_password: z
      .string({ message: "Confirm password must be a string" })
      .trim()
      .min(1, { message: "Password can't be empty" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterAuthType = z.infer<typeof registerSchema>;
export type LoginAuthType = z.infer<typeof loginSchema>;
