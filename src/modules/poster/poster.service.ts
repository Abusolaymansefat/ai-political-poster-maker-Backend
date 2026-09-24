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

interface CreatePosterInput {
      userId: string;
      templateId: string;

      formData: {
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

      photoBuffers: Buffer[];
}

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

            // 2. Ask Gemini for layout
            const layout =
                  await generatePosterLayout(
                        input.formData
                  );

            // 3. Render exact poster
            const posterBuffer = await renderPoster({
                  headline: input.formData.headline,

                  name: input.formData.name,

                  designation:
                        input.formData.designation,

                  ...(input.formData.party !== undefined && {
                        party: input.formData.party
                  }),

                  ...(input.formData.organization !== undefined && {
                        organization: input.formData.organization
                  }),

                  ...(input.formData.district !== undefined && {
                        district: input.formData.district
                  }),

                  photos: photoUrls,

                  layout
            });

            // 4. Upload generated poster
            const generated =
                  await uploadBufferToCloudinary(
                        Buffer.from(posterBuffer),
                        "political-posters/generated"
                  );

            poster.generatedImageUrl =
                  generated.secure_url;

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