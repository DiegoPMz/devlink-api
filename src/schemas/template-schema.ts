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
    { message: "Select a valid platform" },
  )
  .readonly();

const profileLinksSchema = z.object({
  platform: platformsEnumSchema,
  url: z
    .string({ message: "Please provide a URL" })
    .url("This URL format is not valid")
    .trim()
    .min(1, { message: "The URL cannot be empty" }),
});

export const templateSchema = z
  .object({
    profile_email: z
      .string({ message: "Please provide an email address" })
      .email({ message: "This email address is not valid" }),
    profile_name: z
      .string({ message: "Please provide a name" })
      .min(1, { message: "The name cannot be empty" }),
    profile_last_name: z
      .string({ message: "Please provide a last name" })
      .min(1, { message: "The last name cannot be empty" }),
    profile_links: z
      .array(profileLinksSchema, {
        message: "Profile links should be a valid list",
      })
      .nonempty({ message: "The list of user links cannot be empty" }),
  })
  .strict({ message: "The provided data is not correct. Please check again" });

export const getTemplateSchema = z
  .string({ message: "Please provide a template ID" })
  .min(1, { message: "The template ID cannot be empty" })
  .uuid({ message: "Invalid template ID" });

export type TemplateType = z.infer<typeof templateSchema>;
