import axios from "axios";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://user-service:3002";

const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";

export async function createUserProfile(payload: { id: string; email: string }) {
  await axios.post(`${USER_SERVICE_URL}/internal/users`, payload, {
    headers: {
      "x-internal-secret": INTERNAL_SECRET,
    },
    timeout: 5000,
  });
}
