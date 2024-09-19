import { APP_ISSUER, PRIVATE_KEY } from "@/config/securityDetails";
import { JwtPayloadType } from "@/services/jwtTokens-service";
import { errorResponse } from "@/utils/errorResponse-dto";

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token: unknown = req.cookies.access_token;

  if (!token || typeof token !== "string")
    return res
      .status(401)
      .json(errorResponse("No token, authorization denied", "401"));

  jwt.verify(
    token,
    PRIVATE_KEY,
    {
      algorithms: ["HS256"],
      issuer: APP_ISSUER,
    },
    (err, tokenDecoded) => {
      if (err) {
        req.user = undefined;
        return res.status(401).json(errorResponse(err.message, "401"));
      }

      req.user = tokenDecoded as JwtPayloadType;
      return next();
    },
  );

  return;
};

export default verifyToken;
