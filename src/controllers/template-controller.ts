import userModel, { UserSchemaType } from "@/models/user-model";
import { getTemplateSchema, templateSchema } from "@/schemas/template-schema";
import { deleteCloudImage, uploadImage } from "@/services/cloudStorage-service";
import createErrorResponseApp from "@/utils/error-response-app";
import { errorResponse } from "@/utils/errorResponse-dto";
import handleErrorSchema from "@/utils/handle-error-schemas";
import { defaultUserResponseDto } from "@/utils/responseUserModel-dtos";
import { Request, Response } from "express";

type GetTemplateRequest = Request<{ id: string }>;

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    if (!req.body.data)
      return res.status(400).json(
        createErrorResponseApp(400, {
          body: "Missing required 'data' in request body",
        }),
      );

    const parseBody = JSON.parse(req.body.data);
    const reqSchema = templateSchema.safeParse(parseBody);
    if (reqSchema.error || !reqSchema.success) {
      const formattedError = handleErrorSchema(reqSchema.error.errors);
      return res.status(400).json(createErrorResponseApp(400, formattedError));
    }

    const token = req.user;
    if (!token)
      return res.status(500).json(
        createErrorResponseApp(500, {
          service: "An unexpected error occurred. Please try again later",
        }),
      );
    const userDb: UserSchemaType = await userModel
      .findOne({ _id: token.id })
      .catch((res: null) => res);

    if (!userDb)
      return res.status(403).json(
        createErrorResponseApp(403, {
          authentication: "Invalid credentials",
        }),
      );

    const userData = reqSchema.data;
    const reqFile = req.file;
    let uploadImageDetails;

    if (!reqFile && !userDb.profile_image?.id) {
      return res.status(400).json(
        createErrorResponseApp(400, {
          user_file:
            "The user must provide a file if none has been uploaded previously",
        }),
      );
    }

    if (reqFile) {
      const uploadedImage = await uploadImage(reqFile.buffer);
      if (!uploadedImage)
        return res.status(500).json(
          createErrorResponseApp(500, {
            service: "An unexpected error occurred. Please try again later",
          }),
        );

      const dbImageId = userDb.profile_image?.id;
      if (dbImageId) {
        await deleteCloudImage(dbImageId);
      }

      uploadImageDetails = {
        id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    const newTemplateId = crypto.randomUUID();
    const userUpdated = await userModel.findOneAndUpdate(
      { _id: token.id },
      {
        ...userData,
        profile_template: userDb.profile_template ?? newTemplateId,
        profile_image: uploadImageDetails ?? { ...userDb.profile_image },
      },
      { new: true },
    );

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
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "An unexpected error occurred. Please try again later",
      }),
    );
  }
};

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

export const templateDetails = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id)
      return res
        .status(401)
        .json(errorResponse("Authentication failed", "401"));

    const currentTemplate = await userModel.findById(id);

    if (!currentTemplate)
      return res
        .status(404)
        .json(errorResponse("No template found for the authenticated user"));

    return res.json({
      ...defaultUserResponseDto(currentTemplate),
      id: currentTemplate.id,
      createdAt: currentTemplate.createdAt,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json(errorResponse("An unexpected error occurred"));
  }
};
