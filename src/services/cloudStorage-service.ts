import { API_KEY, API_SECRET, CLOUD_NAME } from "@/config/cloudStorage-config";
import {
  v2 as cloudinary,
  ResourceApiResponse,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

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
