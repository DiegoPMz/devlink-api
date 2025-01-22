import {
  getTemplate,
  profileImage,
  updateTemplate,
} from "@/controllers/template-controller";
import storeFile from "@/middlewares/multer-middleware";
import validatorSchema from "@/middlewares/validator-middleware";
import verifyToken from "@/middlewares/verifyToken-middleware";
import { templateSchema } from "@/schemas/template-schema";
import { Router } from "express";

const route = Router();
route.put(
  "/template",
  verifyToken,
  validatorSchema(templateSchema),
  updateTemplate,
);

route.post(
  "/template-image",
  verifyToken,
  storeFile.single("profile_image"),
  profileImage,
);

route.get("/template/:id", getTemplate);

export default route;
