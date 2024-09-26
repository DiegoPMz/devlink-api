import { API_KEY, API_SECRET, CLOUD_NAME } from "@/config/cloudStorage-config";
import {
  v2 as cloudinary,
  ResourceApiResponse,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { createReadStream } from "streamifier";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export const uploadImage = async (imageBuffer: Buffer) => {
  const uploadConfig: UploadApiOptions = {
    resource_type: "auto",
    format: "jpg",
    folder: "devlink",
  };

  return await new Promise<UploadApiResponse | undefined>((resolve) => {
    cloudinary.uploader
      .upload_stream(uploadConfig, (error, uploadResult) => {
        if (error) return console.error(error);
        return resolve(uploadResult);
      })
      .end(imageBuffer);
  });
};

export const uploadImageBuffer = (buffer: Buffer) => {
  const uploadConfig: UploadApiOptions = {
    resource_type: "auto",
    format: "jpg",
    folder: "devlink",
  };

  return new Promise<UploadApiResponse>((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      uploadConfig,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );

    createReadStream(buffer).pipe(cld_upload_stream).on("error", reject);
  });
};

export const findCloudImage = (public_id: string) => {
  return cloudinary.api.resource(public_id, { max_results: 1 }).then(
    (val: ResourceApiResponse) => val,
    () => null,
  );
};

export const deleteCloudImage = (public_id: string) => {
  return cloudinary.uploader.destroy(public_id).then(
    (res) => res,
    () => null,
  );
};
