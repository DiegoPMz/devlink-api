import userModel from "@/models/user-model";
import { getTemplateSchema, templateSchema } from "@/schemas/template-schema";
import { deleteCloudImage, uploadImage } from "@/services/cloudStorage-service";
import { errorResponse } from "@/utils/errorResponse-dto";
import { defaultUserResponseDto } from "@/utils/responseUserModel-dtos";
import { Request, Response } from "express";

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    if (!req.body.data)
      return res.status(400).send("The field Data is missing");

    const parseBody = JSON.parse(req.body.data);
    const reqSchema = templateSchema.safeParse(parseBody);
    if (reqSchema.error || !reqSchema.success) {
      return res.status(400).json(reqSchema.error.formErrors);
    }

    const token = req.user ?? { email: "test@gmail.com" };
    if (!token)
      return res
        .status(404)
        .json(errorResponse("Server error: Unable to complete the request"));
    const userDb = await userModel.findOne({ email: token.email });
    if (!userDb) return res.status(400).send("Invalid credentials");

    const userData = reqSchema.data;
    const reqFile = req.file;

    if (!reqFile && !userData.profile_image)
      return res.status(400).send("One Field image is required");

    let objectToSave = { ...userData };

    if (reqFile) {
      const dbImageId = userDb.profile_image?.id;
      if (dbImageId) await deleteCloudImage(dbImageId);

      const savedImage = await uploadImage(reqFile.buffer);
      if (!savedImage) return res.status(404).send("Internal error");

      objectToSave = {
        ...objectToSave,
        profile_image: {
          id: savedImage.public_id,
          url: savedImage.secure_url,
        },
      };
    } else {
      if (
        !userDb.profile_image?.id ||
        userDb.profile_image?.id !== userData.profile_image?.id
      )
        return res.status(400).send("request image field is not valid");
    }

    const userUpdated = await userModel.findOneAndUpdate(
      { email: token.email },
      { ...objectToSave, profile_template: userDb.id },
      { new: true },
    );
    if (!userUpdated)
      return res
        .status(404)
        .json(errorResponse("Server error: Unable to complete the request"));

    return res.json(defaultUserResponseDto(userUpdated));
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json(errorResponse("Server error: Unable to complete the request"));
  }
};

type GetTemplateRequest = Request<{ id: string }>;

export const getTemplate = async (req: GetTemplateRequest, res: Response) => {
  try {
    const id = req.params.id;
    const idSchema = getTemplateSchema.safeParse(id);
    if (idSchema.error || !idSchema.success)
      return res.status(400).json(errorResponse(idSchema.error.message, "400"));

    const currentTemplate = await userModel.findById(idSchema.data);
    if (!currentTemplate)
      return res
        .status(400)
        .json(errorResponse("User not found with the provided ID", "400"));

    return res.json({
      profile_email: currentTemplate.profile_email,
      profile_name: currentTemplate.profile_name,
      profile_last_name: currentTemplate.profile_last_name,
      profile_image: currentTemplate.profile_image,
      profile_links: currentTemplate.profile_links,
      profile_template: currentTemplate.profile_template,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json(errorResponse("User not found with the provided ID", "400"));
  }
};
