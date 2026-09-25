import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../modules/auth/auth.middleware";

export const adminMiddleware = (
      req: AuthRequest,
      res: Response,
      next: NextFunction
) => {
      if (req.user?.role !== "admin") {
            return res.status(403).json({
                  success: false,
                  message: "Admin access required"
            });
      }

      next();
};