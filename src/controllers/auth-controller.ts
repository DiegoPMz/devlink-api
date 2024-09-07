import UserModel from "@/models/user-model";
import { LoginAuthType, RegisterAuthType } from "@/schemas/auth-schema";
import {
  createAccessToken,
  createRefreshToken,
} from "@/services/jwtTokens-service";
import { comparePasswords } from "@/utils/crypt-password-utils";
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

type RegisterController = RequestHandler<unknown, unknown, RegisterAuthType>;
type LoginController = RequestHandler<unknown, unknown, LoginAuthType>;

export const register: RegisterController = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    const existEmailDb = await UserModel.findOne({ email: email });
    if (existEmailDb)
      return res.status(400).json({
        status: "400",
        message: "Email already in use",
      });
    if (password !== confirm_password)
      return res.status(400).json({
        status: "400",
        message: "invalid password",
      });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email,
      password: passwordHash,
      credentials: { roles: "ROLE_USER" },
      profile_email: email,
      profile_name: "",
      profile_last_name: "",
      profile_image: "",
      profile_links: [],
      profile_template: "",
    });

    const accessToken = await createAccessToken({
      email,
      roles: newUser.credentials?.roles,
      createdAt: newUser.createdAt,
    });
    const refreshToken = await createRefreshToken({
      email,
      roles: newUser.credentials?.roles,
      createdAt: newUser.createdAt,
    });

    res.cookie("access_token", accessToken, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });

    return res.json({
      email: newUser.email,
      profile_email: newUser.email,
      profile_name: "",
      profile_last_name: "",
      profile_image: "",
      profile_links: [],
      profile_template: "",
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      status: "404",
      message: "Server error. Please try again ",
    });
  }
};

export const login: LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDb = await UserModel.findOne({ email: email });

    if (!userDb)
      return res
        .status(400)
        .json({ status: "400", message: "Invalid credentials" });

    const arePasswordEquals = await comparePasswords(
      password,
      userDb.password as string,
    );
    if (!arePasswordEquals)
      return res
        .status(400)
        .json({ status: "400", message: "Incorrect password" });

    const accessToken = await createAccessToken({
      email,
      roles: userDb.credentials?.roles,
      createdAt: userDb.createdAt,
    });
    const refreshToken = await createRefreshToken({
      email,
      roles: userDb.credentials?.roles,
      createdAt: userDb.createdAt,
    });
    res.cookie("access_token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });

    return res.json({
      email: userDb.email,
      profile_email: userDb.profile_email,
      profile_name: userDb.profile_name,
      profile_last_name: userDb.profile_last_name,
      profile_image: userDb.profile_image,
      profile_links: userDb.profile_links,
      profile_template: userDb.profile_template,
      createdAt: userDb.createdAt,
      updatedAt: userDb.updatedAt,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("bad request");
  }
};
