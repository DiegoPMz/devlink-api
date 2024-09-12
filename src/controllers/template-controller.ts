import userModel from "@/models/user-model";
import { TemplateType } from "@/schemas/template-schema";
import { errorResponse } from "@/utils/errorResponse-dto";
import { defaultUserResponseDto } from "@/utils/responseUserModel-dtos";
import { Request, Response } from "express";

type RequestTemplate = Request<unknown, unknown, TemplateType, unknown>;

export const updateTemplate = async (req: RequestTemplate, res: Response) => {
  try {
    const userTokenDetails = req.user;
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
