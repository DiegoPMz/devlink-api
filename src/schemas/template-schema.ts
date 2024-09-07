import z from "zod";

const profileLinksContentSchema = z.object({
  platform: z
    .string({ message: "Platform must be a string" })
    .trim()
    .min(1, { message: "platform can't be empty " }),
  url: z
    .string({ message: "Url must be a string" })
    .trim()
    .min(1, { message: "url can't be empty " }),
});

export const updateTemplateSchema = z.object({
  profile_email: z
    .string({ message: "Email must be a string" })
    .email({ message: "Invalid email" }),
  profile_name: z
    .string({ message: "Name must be a string" })
    .min(1, { message: "Name can't be empty " }),
  profile_last_name: z
    .string({ message: "Last name must be a string" })
    .min(1, { message: "Last name can't be empty " }),
  profile_image: z
    .string({ message: "Last name must be a string" })
    .min(1, { message: "image can't be empty " }),
  profile_links: z
    .array(profileLinksContentSchema)
    .nonempty({ message: "The user links can't be empty" }),
});

export type UpdateTemplateType = z.infer<typeof updateTemplateSchema>;
