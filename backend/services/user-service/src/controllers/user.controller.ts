import { Request, Response } from "express";
import * as userService from "../services/user.service";

/**
 * CREATE USER (internal / admin)
 */
export async function createUser(req: Request, res: Response) {
    const authUser = (req as any).user;
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = await userService.createUser({
            id: authUser.id, // Auth user id
            email,
            firstName,
            lastName,
        });

        res.status(201).json(user);
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({ message: "Failed to create user" });
    }
}

/**
 * GET USER BY ID (admin / debug)
 */
export async function getUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("GET USER ERROR:", err);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}

/**
 * GET CURRENT USER (from JWT)
 * GET /users/me
 */
export async function getMe(req: Request, res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("GET ME ERROR:", err);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}

/**
 * INTERNAL: create user profile from Auth Service
 */
export async function createUserInternal(req: Request, res: Response) {
    const { id, email } = req.body;

    if (!id || !email) {
        return res.status(400).json({ message: "Missing id or email" });
    }

    try {
        const user = await userService.createUser({
            id,
            email,
            firstName: "",
            lastName: "",
        });

        res.status(201).json(user);
    } catch (err) {
        console.error("CREATE USER INTERNAL ERROR:", err);
        res.status(500).json({ message: "Failed to create user" });
    }
}
