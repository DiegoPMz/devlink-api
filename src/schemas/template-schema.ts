import z from "zod";

const platformsEnumSchema = z
  .enum(
    [
      "codewars",
      "codepen",
      "devto",
      "facebook",
      "freecodecamp",
      "frontendmentor",
      "gitlab",
      "github",
      "hashnode",
      "linkedin",
      "stackoverflow",
      "twitter",
      "twitch",
      "youtube",
    ],
    { message: "Invalid platform. Select a valid option" },
  )
  .readonly();

const profileLinksSchema = z.object({
  platform: platformsEnumSchema,
  url: z
    .string({ message: "Url must be a string" })
    .url("Invalid URL format")
    .trim()
    .min(1, { message: "url can't be empty " }),
});

export const templateSchema = z
  .object({
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
      .object({
        id: z.string().min(1, { message: "Image id can't be empty " }),
        url: z.string().min(1, { message: "Image url can't be empty " }),
      })
      .optional(),
    profile_links: z
      .array(profileLinksSchema, {
        message: "Profile links must be a valid array",
      })
      .nonempty({ message: "The user links can't be empty" }),
  })
  .strict({ message: "Incorrect request, please check the data provided" });

export type TemplateType = z.infer<typeof templateSchema>;

export const getTemplateSchema = z
  .string({ message: "The value provided must be a valid string" })
  .min(1, { message: "The Template ID cannot be an empty string" });
