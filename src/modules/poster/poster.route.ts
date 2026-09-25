import { Router } from "express";

import {
      authMiddleware
} from "../auth/auth.middleware";

import {
      upload
} from "../../lib/upload.middleware";

import {
      createPosterController,
      getPoster,
      getMyPosters,
      getUserPosters,
      regeneratePosterController,
      deletePosterController
} from "./poster.controller";

const router = Router();

router.use(authMiddleware);

router.post(
      "/",
      upload.array("photos", 3),
      createPosterController
);

router.get(
      "/my-posters",
      getMyPosters
);

router.get(
      "/user/:userId",
      getUserPosters
);

router.post(
      "/:id/regenerate",
      regeneratePosterController
);

router.delete(
      "/:id",
      deletePosterController
);

router.get(
      "/:id",
      getPoster
);

export default router;