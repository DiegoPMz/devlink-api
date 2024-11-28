import { ClientError } from "@/utils/customErrors";
import multer from "multer";

const storage = multer.memoryStorage();
const FILE_TYPES = ["image/jpeg", "image/png"];
const FILE_SIZE = 1000000;

const storeFile = multer({
  storage,
  limits: {
    files: 1,
    fields: 2,
    fileSize: FILE_SIZE,
  },
  fileFilter(_, file, callback) {
    if (!FILE_TYPES.includes(file.mimetype))
      return callback(
        new ClientError(
          `Invalid file type: ${file.mimetype}. Allowed types are: ${FILE_TYPES.join(", ")}`,
          file.fieldname,
        ),
      );

    return callback(null, true);
  },
});

export default storeFile;
