import { APP_ISSUER, PRIVATE_KEY } from "@/config/jwt-config";
import jwt from "jsonwebtoken";

export interface JwtPayloadType {
  id: string;
  roles: string;
}

interface verifyJWTResponse {
  decoded: undefined | JwtPayloadType;
  error: false | string;
}

const createJWT = (payload: JwtPayloadType, expiresIn: string) => {
  return new Promise<string>((resolve, reject) => {
    const OPTIONS: jwt.SignOptions = {
      algorithm: "HS256",
      issuer: APP_ISSUER,
      subject: payload.id,
      expiresIn: expiresIn,
    };

    jwt.sign(payload, PRIVATE_KEY, OPTIONS, (err, token) => {
      if (err) reject(err.message);
      if (token) resolve(token);
    });
  });
};

export const createAccessToken = (payload: JwtPayloadType) => {
  return createJWT(payload, "30s");
};

export const createRefreshToken = (payload: JwtPayloadType) => {
  return createJWT(payload, "1m");
};

export const verifyJWT = (token: string) => {
  const OPTIONS: jwt.VerifyOptions = {
    algorithms: ["HS256"],
    issuer: APP_ISSUER,
  };

  return new Promise<verifyJWTResponse>((resolve) => {
    jwt.verify(token, PRIVATE_KEY, OPTIONS, (err, tokenDecoded) => {
      if (err) {
        return resolve({
          decoded: undefined,
          error: err.message,
        });
      }

      return resolve({
        decoded: tokenDecoded as JwtPayloadType,
        error: false,
      });
    });
  });
};
