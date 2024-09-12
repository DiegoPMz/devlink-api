import { UserSchemaType } from "@/models/user-model";

export const registerResponseDto = (registerData: UserSchemaType) => ({
  email: registerData.email,
  Profile_email: registerData.email,
  profile_name: "",
  profile_last_name: "",
  profile_image: "",
  profile_links: [],
  profile_template: "",
  createdAt: registerData.createdAt,
});

export const defaultUserResponseDto = (registerData: UserSchemaType) => ({
  email: registerData.email,
  Profile_email: registerData.profile_email ?? "",
  profile_name: registerData.profile_name ?? "",
  profile_last_name: registerData.profile_last_name ?? "",
  profile_image: registerData.profile_image ?? "",
  profile_links: registerData.profile_links ?? [],
  profile_template: registerData.profile_template ?? "",
  updatedAt: registerData.updatedAt,
});
