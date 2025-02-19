import { APP_ISSUER, PRIVATE_KEY } from "@/config/jwt-config";
import tokenModel, { TokenSchemaType } from "@/models/token-model";
import jwt from "jsonwebtoken";

export interface JwtPayloadType {
  id: string;
  roles: string;
  session_id: string;
}

interface verifyJWTResponse {
  decoded: undefined | JwtPayloadType;
  error: undefined | jwt.VerifyErrors;
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
  return createJWT(payload, "10m");
};

export const createRefreshToken = (payload: JwtPayloadType) => {
  return createJWT(payload, "10d");
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
          error: err,
        });
      }

      return resolve({
        decoded: tokenDecoded as JwtPayloadType,
        error: undefined,
      });
    });
  });
};

export const deleteEntityTokenExpired = async (
  token: string,
  type: TokenSchemaType["type"],
) => {
  try {
    const { error } = await verifyJWT(token);
    if (!(error instanceof jwt.TokenExpiredError)) return;

    const decodedToken = jwt.decode(token) as JwtPayloadType;
    return await tokenModel.findOneAndDelete({
      user_id: decodedToken.id,
      token: token,
      type: type,
      session_id: decodedToken.session_id,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
