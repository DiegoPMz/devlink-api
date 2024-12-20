import { APP_ISSUER, PRIVATE_KEY } from "@/config/jwt-config";
import tokenModel from "@/models/token-model";
import { JwtPayloadType } from "@/services/jwtTokens-service";
import createErrorResponseApp from "@/utils/error-response-app";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token: unknown = req.cookies.accToken;

  if (!token || typeof token !== "string")
    return res.status(403).json(
      createErrorResponseApp(403, {
        authentication: "No token, authorization denied",
      }),
    );

  const OPTIONS: jwt.VerifyOptions = {
    algorithms: ["HS256"],
    issuer: APP_ISSUER,
  };

  const invalidateToken = async () => {
    const decodedToken = jwt.decode(token);
    if (!decodedToken || typeof decodedToken === "string") return;

    const id = decodedToken?.id as string;

    await tokenModel
      .findOneAndDelete({ user_id: id, token: token })
      .catch((res) => res);
  };

  jwt.verify(token, PRIVATE_KEY, OPTIONS, (err, tokenDecoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) invalidateToken();
      res.clearCookie("accToken");
      req.user = undefined;
      return res.status(401).json(
        createErrorResponseApp(401, {
          authentication: err.message,
        }),
      );
    }

    req.user = tokenDecoded as JwtPayloadType;
    return next();
  });

  return;
};

export default verifyToken;
