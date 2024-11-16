const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is Being Uploaded Successfully", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
    return null;
  }
};

module.exports = { uploadCloudinary };
