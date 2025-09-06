import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      console.log("No File is Provided to Cloudinary Upload");
      return null;
    }
    console.log(`Uploading to cloudinary : ${filePath}`);
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log(`Cloudinary Upload Successful ${response.url}`);
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    console.log(`Cloudinary Upload Failed ${error.message}`);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(
        `Failed to delete the temp file from Public Folder ${error.message}`
      );
    }
    return null;
  }
};

export { uploadCloudinary };
