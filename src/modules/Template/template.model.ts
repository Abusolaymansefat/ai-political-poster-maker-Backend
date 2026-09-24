import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { getDb } from "../../lib/db";

export interface TemplateDocument {
      _id: ObjectId;
      title: string;
      occasionType: string;
      thumbnailUrl: string;
      backgroundUrl: string;
      layoutConfig: Record<string, unknown>;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
}

const templates = () =>
      getDb().collection<TemplateDocument>("templates");

export const Template = {
      find: (filter: Filter<TemplateDocument> = {}) =>
            templates().find(filter),

      findById: (id: string) => {
            if (!ObjectId.isValid(id)) {
                  return Promise.resolve(null);
            }

            return templates().findOne({
                  _id: new ObjectId(id)
            });
      }
};