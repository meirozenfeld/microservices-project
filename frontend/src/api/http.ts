import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔴 קריטי: לוודא cookies בכל בקשה
http.interceptors.request.use((config) => {
    config.withCredentials = true;
    return config;
});
