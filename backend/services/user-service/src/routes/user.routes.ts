import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createUser, getUser, getMe } from "../controllers/user.controller";

const router = Router();

/**
 * USER SELF
 * Gateway: /users/me
 * Service: /me
 */
router.get("/me", authMiddleware, getMe);

/**
 * ADMIN / INTERNAL
 * Gateway: /users
 * Service: /
 */
router.post("/", authMiddleware, createUser);

/**
 * ADMIN / DEBUG
 * Gateway: /users/:id
 * Service: /:id
 */
router.get("/:id", authMiddleware, getUser);

export default router;
