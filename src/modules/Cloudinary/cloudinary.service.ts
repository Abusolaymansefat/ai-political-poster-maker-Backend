// import cloudinary from "../config/cloudinary";

import cloudinary from "../../lib/cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = "political-posters"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image"
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    stream.end(buffer);
  });
};