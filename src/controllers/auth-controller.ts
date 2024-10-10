import tokenModel from "@/models/token-model";
import UserModel from "@/models/user-model";
import { LoginAuthType, RegisterAuthType } from "@/schemas/auth-schema";
import {
  createAccessToken,
  createRefreshToken,
  deleteEntityTokenExpired,
  JwtPayloadType,
  verifyJWT,
} from "@/services/jwtTokens-service";
import { comparePasswords } from "@/utils/crypt-password-utils";
import { errorResponse } from "@/utils/errorResponse-dto";
import {
  defaultUserResponseDto,
  registerResponseDto,
} from "@/utils/responseUserModel-dtos";
import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";

type RegisterController = RequestHandler<unknown, unknown, RegisterAuthType>;
type LoginController = RequestHandler<unknown, unknown, LoginAuthType>;

export const register: RegisterController = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    const alreadyExistUserDb = await UserModel.findOne({ email: email });
    if (alreadyExistUserDb)
      return res.status(400).json(errorResponse("Email already in use", "400"));
    if (password !== confirm_password)
      return res.status(400).json(errorResponse("invalid password", "400"));

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email,
      password: passwordHash,
      credentials: { roles: "ROLE_USER" },
      profile_email: email,
      profile_name: "",
      profile_last_name: "",
      profile_image: {
        id: "",
        url: "",
      },
      profile_links: [],
      profile_template: "",
    });

    const accessToken = await createAccessToken({
      id: newUser.id,
      roles: newUser.credentials?.roles as string,
    });
    const refreshToken = await createRefreshToken({
      id: newUser.id,
      roles: newUser.credentials?.roles as string,
    });

    await tokenModel.create({
      token: accessToken,
      type: "acc",
      user_id: newUser.id,
    });

    await tokenModel.create({
      token: refreshToken,
      type: "ref",
      user_id: newUser.id,
    });

    res.cookie("accToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refToken", refreshToken, { httpOnly: true, secure: true });

    return res.json(registerResponseDto(newUser));
  } catch (err) {
    console.error(err);
    return res
      .status(404)
      .json(errorResponse("Server error: Unable to complete the request"));
  }
};

export const login: LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDb = await UserModel.findOne({ email: email });

    if (!userDb)
      return res.status(400).json(errorResponse("Invalid credentials", "400"));

    const arePasswordEquals = await comparePasswords(
      password,
      userDb.password as string,
    );
    if (!arePasswordEquals)
      return res.status(400).json(errorResponse("Incorrect password", "400"));

    const accessToken = await createAccessToken({
      id: userDb.id,
      roles: userDb.credentials?.roles as string,
    });
    const refreshToken = await createRefreshToken({
      id: userDb.id,
      roles: userDb.credentials?.roles as string,
    });

    await tokenModel.create({
      token: accessToken,
      type: "acc",
      user_id: userDb.id,
    });

    await tokenModel.create({
      token: refreshToken,
      type: "ref",
      user_id: userDb.id,
    });

    res.cookie("accToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refToken", refreshToken, { httpOnly: true, secure: true });

    return res.json(defaultUserResponseDto(userDb));
  } catch (err) {
    console.log(err);
    return res.status(404).send("Server error: Unable to complete the request");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayloadType;
    const deletedTokens = await tokenModel.deleteMany({ user_id: user.id });
    if (!deletedTokens)
      return res
        .status(404)
        .json(errorResponse("Server error: Unable to complete the request"));

    return res.send("You have been logged out successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json(errorResponse("Server error: Unable to complete the request"));
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refToken: unknown = req.cookies.refToken;

    if (!refToken || typeof refToken !== "string")
      return res
        .status(403)
        .json(
          errorResponse(
            "You do not have permission to perform this action",
            "403",
          ),
        );

    const { decoded, error } = await verifyJWT(refToken);
    if (error || !decoded) {
      res.clearCookie("refToken");
      await deleteEntityTokenExpired(refToken, "ref");

      return res
        .status(401)
        .send(errorResponse(error?.message as string, "401"));
    }

    await tokenModel.findOneAndDelete({
      user_id: decoded.id,
      token: refToken,
      type: "ref",
    });

    const payload = {
      id: decoded.id,
      roles: decoded.roles,
    };

    const newAccessToken = await createAccessToken(payload);
    const newRefreshToken = await createRefreshToken(payload);

    await tokenModel.create({
      token: newAccessToken,
      type: "acc",
      user_id: decoded.id,
    });
    await tokenModel.create({
      token: newRefreshToken,
      type: "ref",
      user_id: decoded.id,
    });

    res.cookie("accToken", newAccessToken, { secure: true, httpOnly: true });
    res.cookie("refToken", newRefreshToken, { secure: true, httpOnly: true });

    return res.send("Tokens generated successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json(errorResponse("Server error: Unable to complete the request"));
  }
};
