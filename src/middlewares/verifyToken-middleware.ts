import { APP_ISSUER, PRIVATE_KEY } from "@/config/jwt-config";
import tokenModel from "@/models/token-model";
import { JwtPayloadType } from "@/services/jwtTokens-service";
import { errorResponse } from "@/utils/errorResponse-dto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// JsonWebTokenError
// NotBeforeError
// TokenExpiredError

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token: unknown = req.cookies.accToken;

  if (!token || typeof token !== "string")
    return res
      .status(403)
      .json(errorResponse("No token, authorization denied", "403"));

  const OPTIONS: jwt.VerifyOptions = {
    algorithms: ["HS256"],
    issuer: APP_ISSUER,
  };

  const invalidateToken = async () => {
    const decodedToken = jwt.decode(token);
    if (!decodedToken || typeof decodedToken === "string") return;

    const id = decodedToken?.id as string;
    try {
      await tokenModel.findOneAndDelete({ user_id: id, token: token });
    } catch (error) {
      console.log(error);
    }
  };

  jwt.verify(token, PRIVATE_KEY, OPTIONS, (err, tokenDecoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) invalidateToken();
      res.clearCookie("accToken");
      req.user = undefined;
      return res.status(401).json(errorResponse(err.message, "401"));
    }

    req.user = tokenDecoded as JwtPayloadType;
    return next();
  });

  return;
};

export default verifyToken;
