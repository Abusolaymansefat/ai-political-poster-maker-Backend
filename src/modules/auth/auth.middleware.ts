// import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { NextFunction, Request, Response } from "express";
// import { env } from "../config/env";

export interface AuthRequest extends Request {
      user?: {
            userId: string;
            role: string;
      };
}

export const authMiddleware = (
      req: AuthRequest,
      res: Response,
      next: NextFunction
) => {
      try {
            const authHeader = req.headers.authorization;

            if (!authHeader?.startsWith("Bearer ")) {
                  return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                  });
            }

            const token = authHeader.slice("Bearer ".length);

            const decoded = jwt.verify(
                  token,
                  config.jwt_secret as string
            );

            if (
                  typeof decoded === "string" ||
                  typeof decoded.userId !== "string" ||
                  typeof decoded.role !== "string"
            ) {
                  throw new Error("Invalid token payload");
            }

            req.user = {
                  userId: decoded.userId,
                  role: decoded.role
            };

            next();
      } catch {
            return res.status(401).json({
                  success: false,
                  message: "Invalid or expired token"
            });
      }
};