import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.middleware";
import { createPoster } from "./poster.service";
import { Poster } from "./poster.model";

export const createPosterController = async (
      req: AuthRequest,
      res: Response
) => {
      try {
            if (!req.user) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                  });
            }

            const {
                  templateId,
                  name,
                  designation,
                  party,
                  organization,
                  union,
                  thana,
                  district,
                  occasion,
                  headline
            } = req.body;

            if (
                  !templateId ||
                  !name ||
                  !designation ||
                  !occasion ||
                  !headline
            ) {
                  return res.status(400).json({
                        success: false,
                        message:
                              "templateId, name, designation, occasion and headline are required"
                  });
            }

            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                  return res.status(400).json({
                        success: false,
                        message: "At least one photo is required"
                  });
            }

            if (files.length > 3) {
                  return res.status(400).json({
                        success: false,
                        message: "Maximum 3 photos allowed"
                  });
            }

            const poster = await createPoster({
                  userId: req.user.userId,

                  templateId,

                  formData: {
                        name,
                        designation,
                        party,
                        organization,
                        union,
                        thana,
                        district,
                        occasion,
                        headline
                  },

                  photoBuffers: files.map(
                        (file) => file.buffer
                  )
            });

            res.status(201).json({
                  success: true,
                  message: "Poster generated successfully",
                  data: poster
            });
      } catch (error: any) {
            console.error(error);

            res.status(500).json({
                  success: false,
                  message:
                        error.message || "Poster generation failed"
            });
      }
};

export const getMyPosters = async (
      req: AuthRequest,
      res: Response
) => {
      if (!req.user) {
            return res.status(401).json({
                  success: false,
                  message: "Unauthorized"
            });
      }

      const posters = await Poster.find({
            userId: req.user.userId
      }).sort({ createdAt: -1 });

      return res.json({
            success: true,
            data: posters
      });
};

export const getPoster = async (
      req: AuthRequest,
      res: Response
) => {
      if (!req.user) {
            return res.status(401).json({
                  success: false,
                  message: "Unauthorized"
            });
      }

      const posterId = req.params.id;

      if (typeof posterId !== "string") {
            return res.status(400).json({
                  success: false,
                  message: "Invalid poster id"
            });
      }

      const poster = await Poster.findOne({
            _id: posterId,
            userId: req.user.userId
      });

      if (!poster) {
            return res.status(404).json({
                  success: false,
                  message: "Poster not found"
            });
      }

      return res.json({
            success: true,
            data: poster
      });
};