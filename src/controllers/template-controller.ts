import { RequestUserPropExtended } from "@/middlewares/verifyToken-middleware";
import userModel from "@/models/user-model";
import { TemplateType } from "@/schemas/template-schema";
import { errorResponse } from "@/utils/errorResponse-dto";
import { defaultUserResponseDto } from "@/utils/responseUserModel-dtos";
import { Response } from "express";

interface RequestTemplate extends RequestUserPropExtended {
  body: TemplateType;
}

export const updateTemplate = async (req: RequestTemplate, res: Response) => {
  try {
    const userTokenDetails = req.userToken;
    const updatedData = req.body;

    const userDb = await userModel.findOneAndUpdate(
      { email: userTokenDetails?.email },
      { $set: updatedData },
      { new: true },
    );

    if (!userDb)
      return res.status(404).json(errorResponse("Something go wrong"));

    return res.json(defaultUserResponseDto(userDb));
  } catch (err) {
    console.error(err);
    return res
      .status(404)
      .json(errorResponse("Server error: Unable to complete the request"));
  }
};
