import { Request, Response, NextFunction } from "express";

export function internalOnly(req: Request, res: Response, next: NextFunction) {
    const expected = process.env.INTERNAL_SECRET;
    const received = req.header("x-internal-secret");

    if (!expected) {
        console.error("INTERNAL_SECRET is not set in user-service env");
        return res.status(500).json({ message: "Internal configuration error" });
    }

    if (!received || received !== expected) {
        return res.status(403).json({ message: "Forbidden (internal only)" });
    }

    next();
}
