import { RequestHandler } from "express";
// import jwt from "jsonwebtoken";
import UserModel from "@/models/user-model";
import {
  createAccessToken,
  createRefreshToken,
} from "@/services/jwtTokens-service";
import { RegisterAuthType } from "@/types";
import bcrypt from "bcryptjs";

type RegisterController = RequestHandler<unknown, unknown, RegisterAuthType>;

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

export const login: RequestHandler = (req, res) => {
  res.send("login");
};
