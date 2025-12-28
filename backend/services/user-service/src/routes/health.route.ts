import { Router } from "express";
import { createUser, getUser, getMe } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "user-service" });
});

router.post("/users", authMiddleware, createUser);
router.get("/users/:id", authMiddleware, getUser);
router.get("/users/me", authMiddleware, getMe);

export default router;
