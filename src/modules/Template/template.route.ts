import { Router } from "express";

import {
  getAllTemplates,
  getSingleTemplate
} from "./template.controller";

const router = Router();

router.get("/", getAllTemplates);
router.get("/:id", getSingleTemplate);

export default router;