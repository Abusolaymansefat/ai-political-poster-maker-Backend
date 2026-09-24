import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model";
import config from "../../config";
// import { env } from "../../config/env";
// import { User } from "./user.model";

export const registerUser = async (
      name: string,
      email: string,
      password: string
) => {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
            throw new Error("User already exists");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
            name,
            email,
            passwordHash,
            role: "user"
      });

      return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
      };
};

export const loginUser = async (
      email: string,
      password: string
) => {
      const user = await User.findOne({ email });

      if (!user) {
            throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
      );

      if (!isPasswordValid) {
            throw new Error("Invalid email or password");
      }

      const signOptions: jwt.SignOptions = {};

      if (config.jwt_expires_in) {
            signOptions.expiresIn =
                  config.jwt_expires_in as NonNullable<
                        jwt.SignOptions["expiresIn"]
                  >;
      }

      const token = jwt.sign(
            {
                  userId: user._id.toString(),
                  role: user.role
            },
            config.jwt_secret as string,
            signOptions
      );

      return {
            token,
            user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role
            }
      };
};