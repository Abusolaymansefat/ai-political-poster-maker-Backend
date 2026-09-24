import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { getDb } from "../../lib/db";

export interface UserDocument {
      _id: ObjectId;
      name: string;
      email: string;
      passwordHash: string;
      role: "user" | "admin";
      createdAt: Date;
      updatedAt: Date;
}

const users = () =>
      getDb().collection<UserDocument>("users");

export const User = {
      findOne: (filter: Filter<UserDocument>) =>
            users().findOne(filter),

      create: async (input: {
            name: string;
            email: string;
            passwordHash: string;
            role?: "user" | "admin";
      }) => {
            const now = new Date();
            const user: UserDocument = {
                  _id: new ObjectId(),
                  name: input.name.trim(),
                  email: input.email.trim().toLowerCase(),
                  passwordHash: input.passwordHash,
                  role: input.role ?? "user",
                  createdAt: now,
                  updatedAt: now
            };

            await users().insertOne(user);
            return user;
      }
};