import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import logger from "./utils/logger";

const port = Number(process.env.PORT || 3001);

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "auth-service listening");
});
