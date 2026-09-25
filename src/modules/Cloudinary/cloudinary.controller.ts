import type { Request, Response } from "express";
import { uploadBufferToCloudinary } from "./cloudinary.service";

export const uploadImage = async (
      req: Request,
      res: Response
) => {
      if (!req.file) {
            return res.status(400).json({
                  success: false,
                  message: "An image file is required"
            });
      }

      try {
            const uploaded = await uploadBufferToCloudinary(
                  req.file.buffer,
                  "political-posters/photos"
            );

            return res.status(201).json({
                  success: true,
                  data: {
                        url: uploaded.secure_url,
                        publicId: uploaded.public_id
                  }
            });
      } catch (error: any) {
            return res.status(502).json({
                  success: false,
                  message: error.message || "Image upload failed"
            });
      }
};
