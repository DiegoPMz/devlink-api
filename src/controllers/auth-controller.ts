import UserModel from "@/models/user-model";
import {
  createAccessToken,
  createRefreshToken,
} from "@/services/jwtTokens-service";
import { LoginAuthType, RegisterAuthType } from "@/types";
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
      Profile_email: email,
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
      Profile_email: newUser.email,
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
    const searchedUserDb = await UserModel.findOne({ email: email });

    if (!searchedUserDb)
      return res
        .status(400)
        .json({ status: "400", message: "Invalid credentials" });

    const arePasswordEquals = await comparePasswords(
      password,
      searchedUserDb.password as string,
    );
    if (!arePasswordEquals)
      return res
        .status(400)
        .json({ status: "400", message: "Incorrect password" });

    const accessToken = await createAccessToken({
      email,
      roles: searchedUserDb.credentials?.roles,
      createdAt: searchedUserDb.createdAt,
    });
    const refreshToken = await createRefreshToken({
      email,
      roles: searchedUserDb.credentials?.roles,
      createdAt: searchedUserDb.createdAt,
    });
    res.cookie("access_token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true , secure: true});

    return res.json({
      email: searchedUserDb.email,
      Profile_email: searchedUserDb.Profile_email,
      profile_name: searchedUserDb.profile_name,
      profile_last_name: searchedUserDb.profile_last_name,
      profile_image: searchedUserDb.profile_image,
      profile_links: searchedUserDb.profile_links,
      profile_template: searchedUserDb.profile_template,
      createdAt: searchedUserDb.createdAt,
      updatedAt: searchedUserDb.updatedAt,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("bad request");
  }
};
