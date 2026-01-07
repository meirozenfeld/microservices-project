"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfile = createUserProfile;
const axios_1 = __importDefault(require("axios"));
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3002";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";
async function createUserProfile(payload) {
    await axios_1.default.post(`${USER_SERVICE_URL}/internal/users`, payload, {
        headers: {
            "x-internal-secret": INTERNAL_SECRET,
        },
        timeout: 5000,
    });
}
