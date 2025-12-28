import { Router } from "express";
import { createUserInternal } from "../controllers/user.controller";
import { internalOnly } from "../middleware/internal.middleware";

const router = Router();

/**
 * INTERNAL ONLY (called by auth-service)
 */
router.post("/internal/users", internalOnly, createUserInternal);

export default router;
