import userModel, { UserSchemaType } from "@/models/user-model";
import { getTemplateSchema, TemplateType } from "@/schemas/template-schema";
import { deleteCloudImage, uploadImage } from "@/services/cloudStorage-service";
import createErrorResponseApp from "@/utils/error-response-app";
import { defaultUserResponseDto } from "@/utils/responseUserModel-dtos";
import { Request, Response } from "express";

export const updateTemplate = async (
  req: Request<unknown, unknown, TemplateType>,
  res: Response,
) => {
  const reqBody = req.body;
  const token = req.user;

  if (!token)
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "An unexpected error occurred. Please try again later",
      }),
    );

  const userDb = await userModel
    .findOne({ _id: token.id })
    .catch((res: null) => res);
  if (!userDb)
    return res.status(403).json(
      createErrorResponseApp(403, {
        authentication: "Invalid credentials",
      }),
    );

  const hasEmptyProfileImage = userDb.toObject().profile_image;
  let templateId: undefined | string = undefined;

  if (hasEmptyProfileImage?.id && hasEmptyProfileImage?.url) {
    templateId = userDb.profile_template ?? crypto.randomUUID();
  }

  const userUpdated = await userModel
    .findOneAndUpdate(
      { _id: token.id },
      {
        ...reqBody,
        profile_template: templateId,
      },
      { new: true },
    )
    .catch(() => null);

  if (!userUpdated)
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "An unexpected error occurred. Please try again later",
      }),
    );

  return res.json({
    ...defaultUserResponseDto(userUpdated),
    id: userUpdated.id,
    updatedAt: userUpdated.updatedAt,
  });
};

type GetTemplateRequest = Request<{ id: string }>;

export const getTemplate = async (req: GetTemplateRequest, res: Response) => {
  try {
    const id = req.params.id;
    const idSchema = getTemplateSchema.safeParse(id);
    if (idSchema.error || !idSchema.success) {
      return res.status(400).json(
        createErrorResponseApp(400, {
          template: idSchema.error.format()._errors[0],
        }),
      );
    }

    const currentTemplate: UserSchemaType = await userModel
      .findOne({
        profile_template: idSchema.data,
      })
      .catch((res: null) => res);

    if (!currentTemplate) {
      return res.status(404).json(
        createErrorResponseApp(404, {
          template: "User not found with the provided ID",
        }),
      );
    }

    let formattedLinks: object[] = [];

    if (
      currentTemplate.profile_links &&
      currentTemplate.profile_links.length > 0
    ) {
      formattedLinks = currentTemplate.profile_links.map((link) => ({
        platform: link.platform,
        url: link.url,
        id: link._id.toString(),
      }));
    }

    return res.json({
      profile_email: currentTemplate.profile_email,
      profile_name: currentTemplate.profile_name,
      profile_last_name: currentTemplate.profile_last_name,
      profile_image: currentTemplate.profile_image,
      profile_links: formattedLinks,
      profile_template: currentTemplate.profile_template,
      theme: currentTemplate.theme,
      template_bg: currentTemplate.template_bg,
    });
  } catch (err) {
    console.error(err);
    return res.status(404).json(
      createErrorResponseApp(404, {
        template: "User not found with the provided ID",
      }),
    );
  }
};

export const profileImage = async (req: Request, res: Response) => {
  const userImage = req.file;
  const userToken = req.user;
  if (!userToken) {
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "An unexpected error occurred. Please try again later",
      }),
    );
  }
  if (!userImage) {
    return res.status(400).json(
      createErrorResponseApp(400, {
        profile_image: "Missing image",
      }),
    );
  }

  const userDb = await userModel
    .findOne({ _id: userToken.id })
    .catch(() => null);
  if (!userDb)
    return res.status(404).json(
      createErrorResponseApp(403, {
        authentication: "User not found",
      }),
    );

  const uploadedImage = await uploadImage(userImage.buffer).catch(
    () => undefined,
  );
  if (!uploadedImage)
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "Image upload failed",
      }),
    );

  if (userDb.profile_image?.id) await deleteCloudImage(userDb.profile_image.id);

  const newUserImage = {
    id: uploadedImage.public_id,
    url: uploadedImage.secure_url,
  };
  const updateResponse = await userModel
    .findByIdAndUpdate(userToken.id, { profile_image: newUserImage })
    .catch(() => null);

  if (!updateResponse) {
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "Failed to update profile image. Please try again later",
      }),
    );
  }

  return res.status(201).json({
    status: 201,
    message: "Operation completed successfully",
    data: newUserImage,
  });
};
