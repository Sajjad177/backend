import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";
import logger from "../logger";


cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});


export const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error: any) {
    logger.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};


export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);

    if (res.result !== "ok" && res.result !== "not found") {
      console.warn(`Cloudinary delete failed for ${publicId}`);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};