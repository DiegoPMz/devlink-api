import UserModel from "@/models/user-model";
import { LoginAuthType, RegisterAuthType } from "@/schemas/auth-schema";
import {
  createAccessToken,
  createRefreshToken,
} from "@/services/jwtTokens-service";
import { comparePasswords } from "@/utils/crypt-password-utils";
import { errorResponse } from "@/utils/errorResponse-dto";
import {
  defaultUserResponseDto,
  registerResponseDto,
} from "@/utils/responseUserModel-dtos";
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

type RegisterController = RequestHandler<unknown, unknown, RegisterAuthType>;
type LoginController = RequestHandler<unknown, unknown, LoginAuthType>;

export const register: RegisterController = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    const existEmailDb = await UserModel.findOne({ email: email });
    if (existEmailDb)
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
      email,
      roles: newUser.credentials?.roles as string,
      createdAt: newUser.createdAt,
    });
    const refreshToken = await createRefreshToken({
      email,
      roles: newUser.credentials?.roles as string,
      createdAt: newUser.createdAt,
    });

    res.cookie("access_token", accessToken, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });

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
      email,
      roles: userDb.credentials?.roles as string,
      createdAt: userDb.createdAt,
    });
    const refreshToken = await createRefreshToken({
      email,
      roles: userDb.credentials?.roles as string,
      createdAt: userDb.createdAt,
    });
    res.cookie("access_token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });

    return res.json(defaultUserResponseDto(userDb));
  } catch (err) {
    console.log(err);
    return res.status(404).send("Server error: Unable to complete the request");
  }
};
