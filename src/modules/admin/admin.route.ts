import { Router } from "express";
import {
      deletePoster,
      deleteUser,
      listPosters,
      listUsers
} from "./admin.controller";

const router = Router();

router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
router.get("/posters", listPosters);
router.delete("/posters/:id", deletePoster);

export default router;