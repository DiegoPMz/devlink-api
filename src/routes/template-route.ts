import {
  getSecureTemplate,
  getTemplate,
  updateTemplate,
} from "@/controllers/template-controller";
import storeFile from "@/middlewares/multer-middleware";
import verifyToken from "@/middlewares/verifyToken-middleware";
import { Router } from "express";

const route = Router();
route.put(
  "/template",
  verifyToken,
  storeFile.single("user_file"),
  updateTemplate,
);
route.get("/template/:id", getTemplate);
route.get("/secure-template", verifyToken, getSecureTemplate);

export default route;
