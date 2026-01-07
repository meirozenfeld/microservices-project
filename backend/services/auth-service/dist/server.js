"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const logger_1 = __importDefault(require("./utils/logger"));
const port = Number(process.env.PORT || 3001);
app_1.app.listen(port, "0.0.0.0", () => {
    logger_1.default.info({ port }, "auth-service listening");
});
