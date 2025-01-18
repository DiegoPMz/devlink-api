import { APP_THEME_OPTIONS, TEMPLATE_BG_OPTIONS } from "@/data/template-data";
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
import createErrorResponseApp from "@/utils/error-response-app";
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
      return res.status(409).json(
        createErrorResponseApp(409, {
          email: "The email address is already in use",
        }),
      );
    if (password !== confirm_password)
      return res.status(400).json(
        createErrorResponseApp(400, {
          password: "Passwords do not match",
        }),
      );

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
      theme: APP_THEME_OPTIONS[0],
      template_bg: TEMPLATE_BG_OPTIONS[0],
    });

    const sessionId = crypto.randomUUID();
    const accessToken = await createAccessToken({
      id: newUser.id,
      roles: newUser.credentials?.roles ?? "ROLE_USER",
      session_id: sessionId,
    });
    const refreshToken = await createRefreshToken({
      id: newUser.id,
      roles: newUser.credentials?.roles ?? "ROLE_USER",
      session_id: sessionId,
    });

    await tokenModel.create({
      token: refreshToken,
      type: "ref",
      user_id: newUser.id,
      session_id: sessionId,
    });

    res.cookie("accToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      ...registerResponseDto(newUser),
      id: newUser.id,
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

export const login: LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDb = await UserModel.findOne({ email: email });

    if (!userDb)
      return res.status(400).json(
        createErrorResponseApp(400, {
          email: "The credentials provided are incorrect",
          password: "The credentials provided are incorrect",
        }),
      );

    const arePasswordEquals = await comparePasswords(
      password,
      userDb.password as string,
    );
    if (!arePasswordEquals)
      return res.status(400).json(
        createErrorResponseApp(400, {
          email: "The credentials provided are incorrect",
          password: "The credentials provided are incorrect",
        }),
      );

    const sessionId = crypto.randomUUID();
    const accessToken = await createAccessToken({
      id: userDb.id,
      roles: userDb.credentials?.roles ?? "ROLE_USER",
      session_id: sessionId,
    });
    const refreshToken = await createRefreshToken({
      id: userDb.id,
      roles: userDb.credentials?.roles ?? "ROLE_USER",
      session_id: sessionId,
    });

    await tokenModel.create({
      token: refreshToken,
      type: "ref",
      user_id: userDb.id,
      session_id: sessionId,
    });

    res.cookie("accToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      ...defaultUserResponseDto(userDb),
      id: userDb.id,
      createdAt: userDb.createdAt,
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

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayloadType;
    res.clearCookie("refToken");
    res.clearCookie("accToken");

    const deletedTokens = await tokenModel
      .deleteMany({
        user_id: user.id,
        session_id: user.session_id,
      })
      .catch(() => null);

    if (!deletedTokens)
      return res.status(500).json(
        createErrorResponseApp(500, {
          service: "Unable to process your request at the moment",
        }),
      );

    return res.status(200).json({
      status: 200,
      message: "You have been logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.clearCookie("refToken");
    res.clearCookie("accToken");
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "Unable to process your request at the moment",
      }),
    );
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refToken: unknown = req.cookies.refToken;

    if (!refToken || typeof refToken !== "string")
      return res.status(403).json(
        createErrorResponseApp(403, {
          authentication: "You do not have permission to perform this action",
        }),
      );

    const { decoded, error } = await verifyJWT(refToken);
    if (error || !decoded) {
      res.clearCookie("refToken");
      await deleteEntityTokenExpired(refToken, "ref");

      return res.status(401).send(
        createErrorResponseApp(401, {
          authentication: "Authentication failed. Please log in again",
        }),
      );
    }

    const getStoredToken = await tokenModel
      .findOneAndDelete({
        token: refToken,
        session_id: decoded.session_id,
        user_id: decoded.id,
      })
      .catch(() => null);

    if (!getStoredToken) {
      res.clearCookie("refToken");
      res.clearCookie("accToken");

      return res.status(401).json(
        createErrorResponseApp(401, {
          authentication: "Token validation failed. Please log in again",
        }),
      );
    }

    const newSessionId = crypto.randomUUID();
    const payload = {
      id: decoded.id,
      roles: decoded.roles,
      session_id: newSessionId,
    };

    const newAccessToken = await createAccessToken(payload);
    const newRefreshToken = await createRefreshToken(payload);

    await tokenModel.create({
      token: newRefreshToken,
      type: "ref",
      user_id: decoded.id,
      session_id: newSessionId,
    });

    res.cookie("accToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      status: 201,
      message: "Operation completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.clearCookie("refToken");
    res.clearCookie("accToken");
    return res.status(500).json(
      createErrorResponseApp(500, {
        service: "Authentication required. Please log in again",
      }),
    );
  }
};
