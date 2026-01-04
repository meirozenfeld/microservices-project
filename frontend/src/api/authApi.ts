import { http } from "./http";

/* =========
   Types
========= */

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  accessToken: string;
};

/* =========
   API calls
========= */

export const authApi = {
  login(payload: LoginPayload) {
    return http.post<AuthResponse>("/auth/login", payload);
  },

  register(payload: RegisterPayload) {
    return http.post<AuthResponse>("/auth/register", payload);
  },

  refresh() {
    return http.post<AuthResponse>("/auth/refresh");
  },

  logout() {
    return http.post("/auth/logout");
  },
};
