import { Router } from "express";

import authRoutes
      from "../modules/auth/auth.route";

import templateRoutes
      from "../modules/Template/template.route";

import posterRoutes
      from "../modules/poster/poster.route";

import { authMiddleware } from "../modules/auth/auth.middleware";
import { upload } from "../lib/upload.middleware";
import { uploadImage } from "../modules/Cloudinary/cloudinary.controller";
import adminRoutes from "../modules/admin/admin.route";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.use(
      "/auth",
      authRoutes
);

router.use(
      "/templates",
      templateRoutes
);

router.post(
      "/upload",
      authMiddleware,
      upload.single("file"),
      uploadImage
);

router.use(
      "/posters",
      posterRoutes
);

router.use(
      "/admin",
      authMiddleware,
      adminMiddleware,
      adminRoutes
);

export default router;