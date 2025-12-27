import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "auth-service" });
});
