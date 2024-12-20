import { APP_THEME_OPTIONS, TEMPLATE_BG_OPTIONS } from "@/data/template-data";
import { UserSchemaType } from "@/models/user-model";

export const registerResponseDto = (
  registerData: NonNullable<UserSchemaType>,
) => ({
  credentials: registerData.credentials,
  email: registerData.email,
  profile_email: registerData.email,
  profile_name: "",
  profile_last_name: "",
  profile_image: "",
  profile_links: [],
  profile_template: null,
  createdAt: registerData.createdAt,
  theme: registerData.theme ?? APP_THEME_OPTIONS[0],
  template_bg: registerData.template_bg ?? TEMPLATE_BG_OPTIONS[0],
});

interface LinkFormatResponse {
  platform: string;
  url: string;
  id: string;
}

export const defaultUserResponseDto = (
  registerData: NonNullable<UserSchemaType>,
) => {
  let formattedLinks: LinkFormatResponse[] = [];

  if (registerData.profile_links && registerData.profile_links.length > 0) {
    formattedLinks = registerData.profile_links.map((link) => ({
      platform: link.platform,
      url: link.url,
      id: link._id.toString(),
    }));
  }

  return {
    credentials: registerData.credentials,
    email: registerData.email,
    profile_email: registerData.profile_email ?? "",
    profile_name: registerData.profile_name ?? "",
    profile_last_name: registerData.profile_last_name ?? "",
    profile_image: registerData.profile_image ?? { id: "", url: "" },
    profile_links: formattedLinks,
    profile_template: registerData.profile_template ?? null,
    theme: registerData.theme ?? APP_THEME_OPTIONS[0],
    template_bg: registerData.template_bg ?? TEMPLATE_BG_OPTIONS[0],
  };
};
