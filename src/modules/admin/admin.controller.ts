import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.middleware";
import { User } from "../auth/user.model";
import { Poster } from "../poster/poster.model";

export const listUsers = async (
      _req: AuthRequest,
      res: Response
) => {
      const users = (await User.findAll()).map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
      }));

      return res.json({
            success: true,
            data: users
      });
};

export const listPosters = async (
      _req: AuthRequest,
      res: Response
) => {
      const posters = await Poster.find()
            .sort({ createdAt: -1 })
            .toArray();

      return res.json({
            success: true,
            data: posters
      });
};

export const deleteUser = async (
      req: AuthRequest,
      res: Response
) => {
      const userId = req.params.id;

      if (typeof userId !== "string" || userId === req.user?.userId) {
            return res.status(400).json({
                  success: false,
                  message: "You cannot delete your own admin account"
            });
      }

      const result = await User.deleteOne(userId);

      if (result.deletedCount === 0) {
            return res.status(404).json({
                  success: false,
                  message: "User not found"
            });
      }

      await Poster.deleteMany({ userId });

      return res.json({
            success: true,
            message: "User and their posters deleted successfully"
      });
};

export const deletePoster = async (
      req: AuthRequest,
      res: Response
) => {
      const posterId = req.params.id;

      if (typeof posterId !== "string") {
            return res.status(400).json({
                  success: false,
                  message: "Invalid poster id"
            });
      }

      const result = await Poster.deleteOne({
            _id: posterId
      });

      if (result.deletedCount === 0) {
            return res.status(404).json({
                  success: false,
                  message: "Poster not found"
            });
      }

      return res.json({
            success: true,
            message: "Poster deleted successfully"
      });
};