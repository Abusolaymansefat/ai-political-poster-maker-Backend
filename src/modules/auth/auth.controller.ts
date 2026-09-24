import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";

export const register = async (
      req: Request,
      res: Response
) => {
      try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "Name, email and password are required"
                  });
            }

            const user = await registerUser(
                  name,
                  email,
                  password
            );

            res.status(201).json({
                  success: true,
                  message: "Registration successful",
                  data: user
            });
      } catch (error: any) {
            res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
};

export const login = async (
      req: Request,
      res: Response
) => {
      try {
            const { email, password } = req.body;

            const result = await loginUser(email, password);

            res.status(200).json({
                  success: true,
                  message: "Login successful",
                  data: result
            });
      } catch (error: any) {
            res.status(401).json({
                  success: false,
                  message: error.message
            });
      }
};