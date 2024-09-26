import multer from "multer";

const storage = multer.memoryStorage();
const FILE_TYPES = ["image/jpeg", "image/png"];
const FILE_SIZE = 1000000;

const storeFile = multer({
  storage,
  limits: {
    files: 1,
    fileSize: FILE_SIZE,
    fields: 2,
  },

  fileFilter(_, file, callback) {
    if (!FILE_TYPES.includes(file.mimetype))
      return callback(
        new multer.MulterError("LIMIT_FIELD_VALUE", file.fieldname),
      );
    return callback(null, true);
  },
});

export default storeFile;
