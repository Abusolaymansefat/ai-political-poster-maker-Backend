import { Poster } from "./poster.model";

import {
      uploadBufferToCloudinary
} from "../Cloudinary/cloudinary.service";

import {
      generatePosterLayout
} from "../../services/gemini.service";

import {
      renderPoster
} from "../../services/poster-render.service";
import { Template } from "../Template/template.model";

const MAX_REGENERATES = 3;

type PosterFormData = {
      name: string;
      designation: string;
      party?: string;
      organization?: string;
      union?: string;
      thana?: string;
      district?: string;
      occasion: string;
      headline: string;
};

interface CreatePosterInput {
      userId: string;
      templateId: string;

      formData: PosterFormData;

      photoBuffers: Buffer[];
}

const generatePosterImage = async (
      formData: PosterFormData,
      photoUrls: string[]
) => {
      const layout = await generatePosterLayout(formData);

      const posterBuffer = await renderPoster({
            headline: formData.headline,
            name: formData.name,
            designation: formData.designation,
            ...(formData.party !== undefined && {
                  party: formData.party
            }),
            ...(formData.organization !== undefined && {
                  organization: formData.organization
            }),
            ...(formData.district !== undefined && {
                  district: formData.district
            }),
            photos: photoUrls,
            layout
      });

      const generated = await uploadBufferToCloudinary(
            Buffer.from(posterBuffer),
            "political-posters/generated"
      );

      return generated.secure_url as string;
};

export const createPoster = async (
      input: CreatePosterInput
) => {
      const template = await Template.findById(
            input.templateId
      );

      if (!template) {
            throw new Error("Template not found");
      }

      const poster = await Poster.create({
            userId: input.userId,
            templateId: input.templateId,
            formData: input.formData,
            status: "generating"
      });

      try {
            // 1. Upload photos
            const photoUrls: string[] = [];

            for (const buffer of input.photoBuffers) {
                  const uploaded =
                        await uploadBufferToCloudinary(
                              buffer,
                              "political-posters/photos"
                        );

                  photoUrls.push(uploaded.secure_url);
            }

            poster.uploadedPhotoUrls = photoUrls;

            await Poster.updateOne(
                  { _id: poster._id },
                  {
                        $set: {
                              uploadedPhotoUrls: photoUrls
                        }
                  }
            );

            // 2. Generate and upload the final poster.
            poster.generatedImageUrl = await generatePosterImage(
                  input.formData,
                  photoUrls
            );

            poster.status = "completed";

            await Poster.updateOne(
                  { _id: poster._id },
                  {
                        $set: {
                              status: poster.status,
                              ...(poster.generatedImageUrl !==
                                    undefined && {
                                    generatedImageUrl:
                                          poster.generatedImageUrl
                              })
                        }
                  }
            );

            return poster;
      } catch (error: any) {
            poster.status = "failed";
            poster.generationError = error.message;

            await Poster.updateOne(
                  { _id: poster._id },
                  {
                        $set: {
                              status: poster.status,
                              ...(poster.generationError !==
                                    undefined && {
                                    generationError:
                                          poster.generationError
                              })
                        }
                  }
            );

            throw error;
      }
};

export const regeneratePoster = async (
      posterId: string,
      userId: string
) => {
      const poster = await Poster.findOne({
            _id: posterId,
            userId
      });

      if (!poster) {
            throw new Error("Poster not found");
      }

      if (poster.regenerateCount >= MAX_REGENERATES) {
            throw new Error(
                  `Maximum ${MAX_REGENERATES} regenerations allowed`
            );
      }

      if (poster.uploadedPhotoUrls.length === 0) {
            throw new Error("Poster has no uploaded photos");
      }

      const formData = poster.formData as PosterFormData;

      try {
            const generatedImageUrl = await generatePosterImage(
                  formData,
                  poster.uploadedPhotoUrls
            );

            await Poster.updateOne(
                  { _id: poster._id, userId },
                  {
                        $set: {
                              generatedImageUrl,
                              status: "completed"
                        },
                        $unset: {
                              generationError: ""
                        },
                        $inc: {
                              regenerateCount: 1
                        }
                  }
            );

            return Poster.findOne({
                  _id: poster._id,
                  userId
            });
      } catch (error: unknown) {
            const message =
                  error instanceof Error
                        ? error.message
                        : "Poster regeneration failed";

            await Poster.updateOne(
                  { _id: poster._id, userId },
                  {
                        $set: {
                              status: "failed",
                              generationError: message
                        }
                  }
            );

            throw error;
      }
};

export const deletePoster = async (
      posterId: string,
      userId: string
) => {
      const result = await Poster.deleteOne({
            _id: posterId,
            userId
      });

      if (result.deletedCount === 0) {
            throw new Error("Poster not found");
      }
};