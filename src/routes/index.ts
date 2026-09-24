import { Router } from "express";

import authRoutes
      from "../modules/auth/auth.route";

import templateRoutes
      from "../modules/Template/template.route";

import posterRoutes
      from "../modules/poster/poster.route";

import {
      generationRateLimit
} from "../middleware/rate-limit.middleware";

const router = Router();

router.use(
      "/auth",
      authRoutes
);

router.use(
      "/templates",
      templateRoutes
);

router.use(
      "/posters",
      generationRateLimit,
      posterRoutes
);

export default router;