import { APP_ISSUER, PRIVATE_KEY } from "@/config/securityDetails";
import jwt from "jsonwebtoken";

export interface JwtPayloadType {
  email: string;
  roles: string;
  createdAt: NativeDate;
}

export const createAccessToken = (payload: JwtPayloadType) => {
  return new Promise<string>((resolve, reject) => {
    const options: jwt.SignOptions = {
      algorithm: "HS256",
      issuer: APP_ISSUER,
      subject: "CURRENT_USER",
      expiresIn: "900000",
    };

    jwt.sign(payload, PRIVATE_KEY, options, (err, token) => {
      if (err) reject(err.message);
      if (token) resolve(token);
    });
  });
};

export const createRefreshToken = (payload: JwtPayloadType) => {
  return new Promise<string>((resolve, reject) => {
    const options: jwt.SignOptions = {
      algorithm: "HS256",
      issuer: APP_ISSUER,
      subject: "CURRENT_USER",
      expiresIn: "20d",
    };

    jwt.sign(payload, PRIVATE_KEY, options, (err, token) => {
      if (err) reject(err.message);
      if (token) resolve(token);
    });
  });
};
