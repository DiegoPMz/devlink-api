import { JwtPayloadType } from "@/services/jwtTokens-service";

declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    interface Request {
      user?: JwtPayloadType;
    }
  }
}
