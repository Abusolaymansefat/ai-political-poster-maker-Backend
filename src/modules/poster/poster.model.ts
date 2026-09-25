import { ObjectId } from "mongodb";
import type { Filter, UpdateFilter } from "mongodb";
import { getDb } from "../../lib/db";

export type PosterStatus =
      | "draft"
      | "generating"
      | "completed"
      | "failed";

export interface PosterDocument {
      _id: ObjectId;
      userId: ObjectId;
      templateId: ObjectId;
      formData: Record<string, string | undefined>;
      uploadedPhotoUrls: string[];
      generatedImageUrl?: string;
      status: PosterStatus;
      regenerateCount: number;
      generationError?: string;
      createdAt: Date;
      updatedAt: Date;
}

type PosterFilter = {
      _id?: string | ObjectId;
      userId?: string | ObjectId;
};

const posters = () =>
      getDb().collection<PosterDocument>("posters");

const objectId = (value: string | ObjectId) =>
      value instanceof ObjectId
            ? value
            : new ObjectId(value);

const normalizeFilter = (filter: PosterFilter): Filter<PosterDocument> => {
      const normalized: Filter<PosterDocument> = {};

      if (filter._id) {
            normalized._id = objectId(filter._id);
      }

      if (filter.userId) {
            normalized.userId = objectId(filter.userId);
      }

      return normalized;
};

export const Poster = {
      find: (filter: PosterFilter = {}) =>
            posters().find(normalizeFilter(filter)),

      findOne: (filter: PosterFilter) =>
            posters().findOne(normalizeFilter(filter)),

      create: async (input: {
            userId: string;
            templateId: string;
            formData: Record<string, string | undefined>;
            status?: PosterStatus;
      }) => {
            const now = new Date();
            const poster: PosterDocument = {
                  _id: new ObjectId(),
                  userId: objectId(input.userId),
                  templateId: objectId(input.templateId),
                  formData: input.formData,
                  uploadedPhotoUrls: [],
                  status: input.status ?? "draft",
                  regenerateCount: 0,
                  createdAt: now,
                  updatedAt: now
            };

            await posters().insertOne(poster);
            return poster;
      },

      updateOne: (
            filter: PosterFilter,
            update: UpdateFilter<PosterDocument>
      ) =>
            posters().updateOne(
                  normalizeFilter(filter),
                  {
                        ...update,
                        $set: {
                              ...(update.$set ?? {}),
                              updatedAt: new Date()
                        }
                  }
            ),

      deleteOne: (filter: PosterFilter) =>
            posters().deleteOne(normalizeFilter(filter)),

      deleteMany: (filter: PosterFilter) =>
            posters().deleteMany(normalizeFilter(filter))
};