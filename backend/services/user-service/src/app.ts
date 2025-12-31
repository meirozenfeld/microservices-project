import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route";
import userRoutes from "./routes/user.routes";
import internalRoutes from "./routes/internal.routes";
import logger from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    logger.info(
        { method: req.method, url: req.url },
        "Incoming request"
    ); next();
});
app.use(healthRouter);
app.use(userRoutes);
app.use(internalRoutes);

export default app;
